# SmartHerbo 🐄⚡️

SmartHerbo is a futuristic, privacy-first livestock management application designed for precision agriculture. It utilizes on-device Machine Learning (TensorFlow.js) to predict cattle weight and provide specialized nutritional requirements (specifically Plantain Herb supplements) based on metabolic scaling.

## 🚀 Key Features

**Hybrid Inference Engine:** Combines a custom neural core (EfficientNet-derived) with classical biometric formulas (Schaeffer's) to provide high-confidence weight estimations.

**Vision Verification:** Integrated COCO-SSD object detection ensures that measurements are only processed if a bovine subject is detected in the frame, preventing data entry errors.

**Metabolic Scaling:** Automatically calculates nutritional dosages (Plantain Herb) using the $Weight^{0.75}$ metabolic scaling formula rather than simple linear scaling.

**100% Privacy & Offline:** All AI processing happens locally on the device hardware. No images or biometric data are ever uploaded to a cloud server.

**Futuristic HUD UI:** A high-contrast, dark-mode interface designed for high visibility in field environments with real-time feedback loops.

## 🧠 Technical Architecture

### 1. AI & Machine Learning Pipeline

The app utilizes tfjsService.ts to manage a dual-stage inference pipeline:

**Stage 1: Object Detection (COCO-SSD):**

Scans the camera stream for cow or horse classes.

Only when a subject is "Locked" with a confidence score $> 0.60$ does the system enable the biometric capture interface.

**Stage 2: Custom Regression Model:**

Processes a dual-input architecture:

- **Image Input:** $[1, 180, 240, 3]$ RGB tensor, normalized to $[0, 1]$.
- **Numeric Input:** $[1, 3]$ vector containing Height, Length, and Heart Girth, normalized using scaler_params.json (Mean/Std scaling).

### 2. The Weight & Confidence Algorithm

To ensure reliability in the field, the system employs a Statistical Validation layer. It calculates the delta between the AI's neural prediction and the mathematical Schaeffer's Formula:

$$
\text{Weight (lbs)} = \frac{\text{Heart Girth}^2 \times \text{Length}}{300}
$$

**Confidence Scoring Logic:**

- **PRECISE ($>95\%$):** Neural prediction and Schaeffer formula are within $2\%$ variance.
- **NOMINAL ($85-95\%$):** Variance is within $10\%$.
- **STOCHASTIC ($<85\%$):** High variance detected. The system suggests re-measuring the heart girth or improving lighting for the AI camera.

### 3. Nutritional Science (Plantain Herb Requirements)

The application calculates the specific dosage of Plantain Herb based on the animal's metabolic needs rather than total mass. This is crucial for herbs with high bioactive concentrations.

**Formula:**
$$
\text{Metabolic Weight} = \text{Body Weight (kg)}^{0.75}
$$

**Scaling Logic:** The app uses a baseline of **50g of supplement per 200kg of body weight**.

**Equation:**
$$
\text{Dosage} = \frac{\text{Animal Metabolic Weight}}{\text{Baseline Metabolic Weight (200kg)}} \times 50g
$$

## 🛠 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-repo/smart-herbo.git](https://github.com/your-repo/smart-herbo.git)
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Model Assets:**
   Place `model.json`, `group1-shard.bin`, and `scaler_params.json` in the `/public` folder.

4. **Environment:**
   The app requires a browser with WebGL support for TensorFlow.js acceleration.

## 📱 User Guide & Workflow

1. **Initialize Engine:** On first launch, the app downloads and warms up the local models. This may take a few seconds depending on device GPU.
2. **Subject Lock:** Point the camera at the animal. Wait for the **"Target Acquired"** HUD element to turn blue.
3. **Measurement Input:** Measure the animal using a physical tape:
   - **Heart Girth:** Around the chest, just behind the front legs.
   - **Length:** From the point of the shoulder to the point of the rump.
   - **Height:** From the ground to the highest point of the wither.
4. **Analysis:** Tap "Analyze Biometrics" to trigger the hybrid inference.
5. **Report Card:** View the results. You can toggle between **Metric (kg)** and **Imperial (lbs)** units.

## 🛠 Troubleshooting

- **"Sensor Error":** Ensure camera permissions are granted in the browser.
- **"Stochastic Result":** This occurs when the physical measurements and the AI's visual estimation don't align. Check if the units (Inches vs Centimeters) were entered correctly.
- **Low Performance:** If the HUD lags, ensure "Hardware Acceleration" is enabled in your browser settings.

## 📄 License & Credits

Developed for the **BAU Agro System Logic** initiative. 
- **Core Logic:** TensorFlow.js / React
- **Icons:** Lucide-React
- **Design:** Futuristic HUD Protocol v4.2

**Disclaimer:** *SmartHerbo is an estimation tool. For medical emergencies or precise pharmaceutical dosing, always consult a certified veterinarian.*
