SmartHerbo 🐄⚡️

SmartHerbo is a futuristic, privacy-first livestock management application designed for precision agriculture. It utilizes on-device Machine Learning (TensorFlow.js) to predict cattle weight and provide specialized nutritional requirements (specifically Plantain Herb supplements) based on metabolic scaling.

🚀 Key Features

Hybrid Inference Engine: Combines a custom neural core with classical biometric formulas (Schaeffer’s) to provide high-confidence weight estimations.

Vision Verification: Integrated COCO-SSD object detection ensures that measurements are only processed if a bovine subject is detected in the frame, preventing data entry errors.

Metabolic Scaling: Automatically calculates nutritional dosages (Plantain Herb) using the $Weight^{0.75}$ metabolic scaling formula rather than simple linear scaling.

100% Privacy & Offline: All AI processing happens locally on the device hardware. No images or biometric data are ever uploaded to a cloud server.

Futuristic HUD UI: A high-contrast, dark-mode interface designed for high visibility in field environments.

🧠 Technical Architecture

1. AI & Machine Learning

The app utilizes tfjsService.ts to manage two distinct models:

Object Detection: Uses COCO-SSD to identify "cow" or "horse" classes to verify the subject.

Custom Regression Model: A multi-input model that processes:

Image Input: $[1, 180, 240, 3]$ tensor of the subject.

Numeric Input: Normalized dimensions (Height, Length, Girth).

2. The Weight Algorithm

The system calculates a "Confidence Score" by comparing the Neural output with the Schaeffer's Formula:


$$\text{Weight (lbs)} = \frac{\text{Heart Girth}^2 \times \text{Length}}{300}$$


If the AI prediction deviates significantly from the biometric calculation, the system flags the result as "Stochastic" (low confidence).

3. Nutritional Science

The herb requirement is calculated in calculationService.ts using the Metabolic Weight of the animal:


$$\text{Metabolic Weight} = \text{Body Weight (kg)}^{0.75}$$


The Plantain Herb dosage is then scaled against a 200kg baseline to ensure the animal receives a physiologically appropriate supplement amount.

🛠 Installation & Setup

Clone the repository:

git clone [https://github.com/your-repo/smart-herbo.git](https://github.com/your-repo/smart-herbo.git)


Install dependencies:

npm install


Model Assets:
Ensure model.json and the associated binary shards are placed in the public/ directory.

Run Development Server:

npm run dev


📱 User Guide

Initialize Engine: Complete the onboarding tutorial to load the neural cores into your browser's memory.

Vision Lock: Use the camera module. The capture button will only "lock" (turn blue) once the AI detects a bovine subject.

Input Biometrics: Enter the physical dimensions (Heart Girth, Body Length, and Height).

Generate Report: Review the "Bovine Health Report" which includes weight predictions, confidence gauges, and specific Plantain Herb dosage instructions.

📄 License

This project is developed for the BAU Agro System Logic initiative. Distributed under the MIT License.

Disclaimer: SmartHerbo is an estimation tool. For medical emergencies or precise pharmaceutical dosing, always consult a certified veterinarian.
