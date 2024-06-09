const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([256, 256]) // Resize to 256x256
    .expandDims()
    .toFloat();

  const prediction = model.predict(tensor);
  const score = await prediction.data();
  const confidenceScore = Math.max(...score) * 100;

  // New set of class labels
  const classes = [
    'Apple scab', 
    'Apple Black rot', 
    'Cedar apple rust', 
    'Apple healthy', 
    'Blueberry healthy', 
    'Cherry Powdery mildew', 
    'Cherry healthy', 
    'Corn Cercospora leaf spot Gray leaf spot', 
    'Corn Common rust', 
    'Corn Northern Leaf Blight', 
    'Corn healthy', 
    'Grape Black rot', 
    'Grape Esca (Black Measles)', 
    'Grape Leaf blight', 
    'Grape healthy', 
    'Orange Haunglongbing (Citrus greening)', 
    'Peach Bacterial spot', 
    'Peach healthy', 
    'Pepper, bell Bacterial spot', 
    'Pepper, bell healthy', 
    'Potato Early blight', 
    'Potato Late blight', 
    'Potato healthy', 
    'Raspberry healthy', 
    'Soybean healthy', 
    'Squash Powdery mildew', 
    'Strawberry Leaf scorch', 
    'Strawberry healthy', 
    'Tomato Bacterial spot', 
    'Tomato Early blight', 
    'Tomato Late blight', 
    'Tomato Leaf Mold', 
    'Tomato Septoria leaf spot', 
    'Tomato Spider-mites Two spotted spider mite', 
    'Tomato Target Spot', 
    'Tomato Yellow Leaf Curl Virus', 
    'Tomato mosaic virus', 
    'Tomato healthy'
  ];

  const classResult = tf.argMax(prediction, 1).dataSync()[0];
  const label = classes[classResult];

  let explanation;

  // Provide explanations based on the predicted class
  switch (label) {
    case 'Apple scab':
      explanation = "Apple scab is a disease caused by the fungus Venturia inaequalis.";
      break;
    case 'Apple Black rot':
      explanation = "Apple Black rot is caused by the fungus Botryosphaeria obtusa.";
      break;
    case 'Cedar apple rust':
      explanation = "Cedar apple rust is caused by the fungus Gymnosporangium juniperi-virginianae.";
      break;
    case 'Apple healthy':
      explanation = "The apple plant is healthy.";
      break;
    case 'Blueberry healthy':
      explanation = "The blueberry plant is healthy.";
      break;
    case 'Cherry Powdery mildew':
      explanation = "Cherry Powdery mildew is caused by the fungus Podosphaera clandestina.";
      break;
    case 'Cherry healthy':
      explanation = "The cherry plant is healthy.";
      break;
    case 'Corn Cercospora leaf spot Gray leaf spot':
      explanation = "Cercospora leaf spot, also known as Gray leaf spot, is caused by the fungus Cercospora zeae-maydis.";
      break;
    case 'Corn Common rust':
      explanation = "Common rust of corn is caused by the fungus Puccinia sorghi.";
      break;
    case 'Corn Northern Leaf Blight':
      explanation = "Northern Leaf Blight of corn is caused by the fungus Exserohilum turcicum.";
      break;
    case 'Corn healthy':
      explanation = "The corn plant is healthy.";
      break;
    case 'Grape Black rot':
      explanation = "Grape Black rot is caused by the fungus Guignardia bidwellii.";
      break;
    case 'Grape Esca (Black Measles)':
      explanation = "Grape Esca, also known as Black Measles, is caused by a complex of fungi.";
      break;
    case 'Grape Leaf blight':
      explanation = "Grape Leaf blight is caused by the fungus Pseudocercospora vitis.";
      break;
    case 'Grape healthy':
      explanation = "The grape plant is healthy.";
      break;
    case 'Orange Haunglongbing (Citrus greening)':
      explanation = "Haunglongbing, also known as Citrus greening, is caused by a bacterium spread by the Asian citrus psyllid.";
      break;
    case 'Peach Bacterial spot':
      explanation = "Peach Bacterial spot is caused by the bacterium Xanthomonas campestris pv. pruni.";
      break;
    case 'Peach healthy':
      explanation = "The peach plant is healthy.";
      break;
    case 'Pepper, bell Bacterial spot':
      explanation = "Bacterial spot on bell peppers is caused by several species of Xanthomonas.";
      break;
    case 'Pepper, bell healthy':
      explanation = "The bell pepper plant is healthy.";
      break;
    case 'Potato Early blight':
      explanation = "Potato Early blight is caused by the fungus Alternaria solani.";
      break;
    case 'Potato Late blight':
      explanation = "Potato Late blight is caused by the oomycete Phytophthora infestans.";
      break;
    case 'Potato healthy':
      explanation = "The potato plant is healthy.";
      break;
    case 'Raspberry healthy':
      explanation = "The raspberry plant is healthy.";
      break;
    case 'Soybean healthy':
      explanation = "The soybean plant is healthy.";
      break;
    case 'Squash Powdery mildew':
      explanation = "Powdery mildew on squash is caused by several species of fungi including Erysiphe cichoracearum and Podosphaera xanthii.";
      break;
    case 'Strawberry Leaf scorch':
      explanation = "Strawberry Leaf scorch is caused by the fungus Diplocarpon earliana.";
      break;
    case 'Strawberry healthy':
      explanation = "The strawberry plant is healthy.";
      break;
    case 'Tomato Bacterial spot':
      explanation = "Tomato Bacterial spot is caused by several species of Xanthomonas.";
      break;
    case 'Tomato Early blight':
      explanation = "Tomato Early blight is caused by the fungus Alternaria solani.";
      break;
    case 'Tomato Late blight':
      explanation = "Tomato Late blight is caused by the oomycete Phytophthora infestans.";
      break;
    case 'Tomato Leaf Mold':
      explanation = "Tomato Leaf Mold is caused by the fungus Passalora fulva.";
      break;
    case 'Tomato Septoria leaf spot':
      explanation = "Tomato Septoria leaf spot is caused by the fungus Septoria lycopersici.";
      break;
    case 'Tomato Spider-mites Two spotted spider mite':
      explanation = "Two-spotted spider mite infestation on tomatoes is caused by the mite Tetranychus urticae.";
      break;
    case 'Tomato Target Spot':
      explanation = "Tomato Target Spot is caused by the fungus Corynespora cassiicola.";
      break;
    case 'Tomato Yellow Leaf Curl Virus':
      explanation = "Tomato Yellow Leaf Curl Virus is caused by a complex of viruses transmitted by whiteflies.";
      break;
    case 'Tomato mosaic virus':
      explanation = "Tomato mosaic virus is caused by the Tobacco mosaic virus.";
      break;
    case 'Tomato healthy':
      explanation = "The tomato plant is healthy.";
      break;
    default:
      explanation = "No specific information available.";
  }

  return { confidenceScore, label, explanation };
}

module.exports = predictClassification;
