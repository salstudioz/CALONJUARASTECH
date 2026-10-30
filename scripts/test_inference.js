const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const tf = require('@tensorflow/tfjs');

async function testModel() {
  const modelDir = path.join(__dirname, '..', 'public', 'models', 'teachable_machine');
  const metadata = JSON.parse(fs.readFileSync(path.join(modelDir, 'metadata.json'), 'utf-8'));
  const modelJson = JSON.parse(fs.readFileSync(path.join(modelDir, 'model.json'), 'utf-8'));
  const weightsBin = fs.readFileSync(path.join(modelDir, 'weights.bin'));

  // Custom loader for Node.js
  const ioHandler = {
    load: async () => {
      return {
        modelTopology: modelJson.modelTopology,
        weightSpecs: modelJson.weightsManifest[0].weights,
        weightData: weightsBin.buffer.slice(weightsBin.byteOffset, weightsBin.byteOffset + weightsBin.byteLength)
      };
    }
  };

  const model = await tf.loadLayersModel(ioHandler);

  const testImages = [
    { label: 'Padi Blas Test', path: 'daun demo/padi/padi_blas.jpg' },
    { label: 'Bukan Daun (Meja)', path: 'daun demo/uji_bukan_daun/bukan_daun_meja_kantor.jpg' },
    { label: 'Cabai Sehat Test', path: 'daun demo/cabe/cabe_sehat.jpg' },
    { label: 'Tomat Early Blight', path: 'daun demo/tomat/tomat_early_blight.jpg' }
  ];

  console.log('=== HASIL TEST INFERENSI NYATA MODEL TEACHABLE MACHINE ===');
  for (const item of testImages) {
    const raw = jpeg.decode(fs.readFileSync(path.join(__dirname, '..', item.path)));
    const tensor = tf.tensor3d(raw.data, [raw.height, raw.width, 4])
      .slice([0, 0, 0], [-1, -1, 3])
      .resizeBilinear([metadata.imageSize, metadata.imageSize])
      .expandDims(0)
      .toFloat()
      .div(127.5)
      .sub(1.0);

    const pred = model.predict(tensor);
    const data = await pred.data();
    tensor.dispose();
    pred.dispose();

    const results = metadata.labels.map((name, i) => ({
      name,
      prob: data[i],
      pct: (data[i] * 100).toFixed(1) + '%'
    })).sort((a, b) => b.prob - a.prob);

    console.log(`\nInput Gambar: [${item.label}] (${item.path})`);
    console.log(`-> Prediksi Kelas Utama: ${results[0].name} (${results[0].pct})`);
    console.log(`-> Top 3 Probabilitas : ${results.slice(0, 3).map(r => `${r.name}: ${r.pct}`).join(', ')}`);
  }
}

testModel().catch(console.error);
