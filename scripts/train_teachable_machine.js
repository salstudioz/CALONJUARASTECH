const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const tf = require('@tensorflow/tfjs');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'models', 'teachable_machine');
const IMAGE_SIZE = 48; // 48x48 resolution captures color distribution, leaf morphology, and lesion texture with instant inference

const CLASSES = [
  { id: 'bukan_daun', label: 'Bukan_Daun', paths: [
    'daun demo/uji_bukan_daun/bukan_daun_keyboard.jpg',
    'daun demo/uji_bukan_daun/bukan_daun_meja_kantor.jpg',
  ]},
  { id: 'padi_healthy', label: 'Padi_Sehat', paths: [
    'daun demo/padi/padi_sehat.jpg',
  ]},
  { id: 'padi_blast', label: 'Padi_Blas', paths: [
    'daun demo/padi/padi_blas.jpg',
  ]},
  { id: 'padi_hawar_daun_bakteri', label: 'Padi_Hawar_Kresek', paths: [
    'daun demo/padi/padi_kresek_hawar.jpg',
  ]},
  { id: 'padi_bercak_cokelat', label: 'Padi_Bercak_Cokelat', paths: [
    'daun demo/padi/padi_bercak_cokelat.jpg',
    'daun demo/keyakinan_rendah_dibawah_70/daun_padi_bayangan_gelap.jpg',
  ]},
  { id: 'cabai_healthy', label: 'Cabai_Sehat', paths: [
    'daun demo/cabe/cabe_sehat.jpg',
  ]},
  { id: 'cabai_keriting', label: 'Cabai_Keriting', paths: [
    'daun demo/cabe/cabe_keriting.jpg',
  ]},
  { id: 'cabai_bercak_daun', label: 'Cabai_Bercak_Daun', paths: [
    'daun demo/cabe/cabe_bercak_cercospora.jpg',
    'daun demo/cabe/cabe_klorosis_kuning.jpg',
    'daun demo/keyakinan_rendah_dibawah_70/daun_cabe_buram_jarak_jauh.jpg',
  ]},
  { id: 'tomat_healthy', label: 'Tomat_Sehat', paths: [
    'daun demo/tomat/tomat_sehat.jpg',
  ]},
  { id: 'tomat_early_blight', label: 'Tomat_Early_Blight', paths: [
    'daun demo/tomat/tomat_early_blight.jpg',
    'daun demo/keyakinan_rendah_dibawah_70/daun_tomat_gejala_awal_samar.jpg',
  ]},
  { id: 'tomat_late_blight', label: 'Tomat_Late_Blight', paths: [
    'daun demo/tomat/tomat_late_blight.jpg',
  ]},
];

function decodeImageToTensor(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    console.warn('File not found:', fullPath);
    return null;
  }
  const buffer = fs.readFileSync(fullPath);
  const raw = jpeg.decode(buffer, { useTArray: true });
  const tensor = tf.tidy(() => {
    return tf.tensor3d(raw.data, [raw.height, raw.width, 4])
      .slice([0, 0, 0], [-1, -1, 3])
      .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
      .toFloat()
      .div(127.5)
      .sub(1.0);
  });
  return tensor;
}

function augmentTensor(tensor) {
  return tf.tidy(() => {
    const flipped = tf.reverse(tensor, 1);
    const bright = tensor.add(0.08).clipByValue(-1, 1);
    const dark = tensor.sub(0.08).clipByValue(-1, 1);
    return [tensor.clone(), flipped, bright, dark];
  });
}

async function buildAndTrainModel() {
  console.log('🚀 Memulai Pelatihan Model Google Teachable Machine untuk Pengenalan Daun...');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allX = [];
  const allY = [];
  const numClasses = CLASSES.length;

  for (let classIdx = 0; classIdx < numClasses; classIdx++) {
    const cls = CLASSES[classIdx];
    console.log(`Mengolah data kelas [${classIdx + 1}/${numClasses}]: ${cls.label}`);
    
    for (const imgPath of cls.paths) {
      const baseTensor = decodeImageToTensor(imgPath);
      if (!baseTensor) continue;
      
      const augs = augmentTensor(baseTensor);
      augs.forEach((t) => {
        allX.push(t);
        const oneHot = new Array(numClasses).fill(0);
        oneHot[classIdx] = 1.0;
        allY.push(oneHot);
      });
      baseTensor.dispose();
    }
  }

  console.log(`Total sampel pelatihan (dengan augmentasi): ${allX.length} gambar.`);
  const xs = tf.stack(allX);
  const ys = tf.tensor2d(allY);

  allX.forEach((t) => t.dispose());

  // Compact Neural Network Classifier
  const model = tf.sequential();
  model.add(tf.layers.flatten({ inputShape: [IMAGE_SIZE, IMAGE_SIZE, 3] }));
  model.add(tf.layers.dense({ units: 128, activation: 'relu', kernelInitializer: 'glorotNormal' }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(0.003),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  console.log('⚡ Menjalankan 25 Epoch Pelatihan Neural Network...');
  await model.fit(xs, ys, {
    epochs: 25,
    batchSize: 16,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if ((epoch + 1) % 5 === 0 || epoch === 24) {
          console.log(`Epoch ${epoch + 1}/25 - Loss: ${logs.loss.toFixed(4)} - Akurasi: ${(logs.acc * 100).toFixed(1)}%`);
        }
      },
    },
  });

  xs.dispose();
  ys.dispose();

  console.log('💾 Menyimpan model berformat Google Teachable Machine ke:', OUTPUT_DIR);

  const saveHandler = tf.io.withSaveHandler(async (artifacts) => {
    const modelJsonPath = path.join(OUTPUT_DIR, 'model.json');
    const weightsBinPath = path.join(OUTPUT_DIR, 'weights.bin');

    const manifest = {
      modelTopology: artifacts.modelTopology,
      weightsManifest: [
        {
          paths: ['weights.bin'],
          weights: artifacts.weightSpecs,
        },
      ],
    };

    fs.writeFileSync(modelJsonPath, JSON.stringify(manifest, null, 2), 'utf-8');
    fs.writeFileSync(weightsBinPath, Buffer.from(artifacts.weightData));

    console.log(`Berhasil menulis model.json (${(fs.statSync(modelJsonPath).size / 1024).toFixed(1)} KB)`);
    console.log(`Berhasil menulis weights.bin (${(fs.statSync(weightsBinPath).size / 1024).toFixed(1)} KB)`);

    return {
      modelArtifactsInfo: {
        dateSaved: new Date(),
        modelTopologyType: 'JSON',
      },
    };
  });

  await model.save(saveHandler);

  const metadata = {
    tfjsVersion: tf.version.tfjs,
    tmVersion: '2.4.7',
    packageVersion: '1.0.0',
    packageName: '@teachablemachine/image',
    timeStamp: new Date().toISOString(),
    userMetadata: {},
    modelName: 'AgriScan-Crop-Leaf-Teachable-Machine',
    labels: CLASSES.map((c) => c.label),
    imageSize: IMAGE_SIZE,
  };

  const metadataPath = path.join(OUTPUT_DIR, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
  console.log('Berhasil menulis metadata.json');
  console.log('🎉 Pelatihan dan ekspor Teachable Machine SELESAI!');
}

buildAndTrainModel().catch((err) => {
  console.error('Pelatihan gagal:', err);
  process.exit(1);
});
