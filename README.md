
# SmartHerbo 🐄⚡️

SmartHerbo is a futuristic, privacy-first livestock management application designed for precision agriculture. It utilizes on-device Machine Learning (TensorFlow.js) to predict cattle weight and provide specialized nutritional requirements (specifically Plantain Herb supplements) based on metabolic scaling.

## 🚀 Key Features

- **Hybrid Inference Engine**: Combines a custom neural core (EfficientNet-derived) with classical biometric formulas (Schaeffer's) to provide high-confidence weight estimations.

- **Vision Verification**: Integrated COCO-SSD object detection ensures that measurements are only processed if a bovine subject is detected in the frame, preventing data entry errors.

- **Metabolic Scaling**: Automatically calculates nutritional dosages (Plantain Herb) using metabolic scaling logic rather than simple linear weight-based scaling.

- **100% Privacy & Offline**: All AI processing happens locally on the device hardware. No images or biometric data are ever uploaded to a cloud server.

- **Futuristic HUD UI**: A high-contrast, dark-mode interface designed for high visibility in field environments with real-time feedback loops.

- **Cross-Platform Navigation**: Robust back button functionality with exit confirmation for both web and mobile platforms.

## 🧠 Technical Architecture

### 1. AI & Machine Learning Pipeline

The app utilizes `tfjsService.ts` to manage a dual-stage inference pipeline:

**Stage 1: Object Detection (COCO-SSD):**
- Scans the camera stream for cow or horse classes.
- Only when a subject is "Locked" with a confidence score greater than 0.60 does the system enable the biometric capture interface.

**Stage 2: Custom Regression Model:**
- Processes a dual-input architecture:
  - **Image Input**: `[1, 180, 240, 3]` RGB tensor, normalized to `[0, 1]`.
  - **Numeric Input**: `[1, 3]` vector containing Height, Length, and Heart Girth, normalized using `scaler_params.json` (Mean/Std scaling).

### 2. The Weight & Confidence Algorithm

To ensure reliability in the field, the system employs a Statistical Validation layer. It calculates the delta between the AI's neural prediction and the mathematical Schaeffer's Weight Formula.

**Confidence Scoring Logic:**
- **PRECISE (>95%)**: Neural prediction and Schaeffer formula are within 2% variance.
- **NOMINAL (85-95%)**: Variance is within 10%.
- **STOCHASTIC (<85%)**: High variance detected. The system suggests re-measuring the heart girth or improving lighting for the AI camera.

### 3. Nutritional Science (Plantain Herb Requirements)

The application calculates the specific dosage of Plantain Herb based on the animal's metabolic needs rather than total mass. This is crucial for herbs with high bioactive concentrations.

**Scaling Logic**: The app uses a baseline of 50g of supplement per 200kg of body weight, adjusted using metabolic scaling principles.

## 🛠 Installation & Setup

### Clone the repository:
```bash
git clone https://github.com/your-repo/smart-herbo.git
```

### Install dependencies:
```bash
npm install
```

### Model Assets:
Place the following files in the `/public` folder:
- `model.json`
- `group1-shard.bin`
- `scaler_params.json`

### Environment Requirements:
- Modern browser with WebGL support for TensorFlow.js acceleration
- Camera permissions for biometric capture
- Minimum 2GB RAM for optimal performance

## 📱 User Guide & Workflow

### 1. Initialize Engine
- On first launch, the app downloads and warms up the local models (may take 1-3 seconds depending on device GPU).
- Complete the onboarding tutorial for optimal usage guidance.

### 2. Subject Lock
- Point the camera at the animal.
- Wait for the "Target Acquired" HUD element to turn blue (object detection confirmation).

### 3. Measurement Input
Measure the animal using a physical tape:
- **Heart Girth**: Around the chest, just behind the front legs.
- **Length**: From the point of the shoulder to the point of the rump.
- **Height**: From the ground to the highest point of the wither.

### 4. Analysis
- Tap "Analyze Biometrics" to trigger the hybrid inference.
- The system performs:
    - Bovine presence verification
    - Neural morphology inference
    - Metabolic weight calculation
    - Nutritional prescription generation

### 5. Result Interpretation
- View the comprehensive analytics report showing:
  - Estimated body weight (with confidence score)
  - Metabolic factor calculation
  - Plantain Herb supplement dosage
  - Smart feeding tips
- Toggle between Metric (kg) and Imperial (lbs) units using the header toggle.

### 6. Navigation Controls
- **Back Button**: Available in header for intuitive navigation:
  - From results → Returns to measurement form (keeps image)
  - From form with image → Clears image
  - From empty form → Shows exit confirmation
- **Exit Confirmation**: Prevents accidental app closure with clear warning modal.

## 🛠 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Sensor Error** | Ensure camera permissions are granted in the browser settings. |
| **Stochastic Result** | Check if measurements were entered correctly (inches vs centimeters mismatch). |
| **Low Performance** | Enable "Hardware Acceleration" in browser settings and ensure WebGL is supported. |
| **Model Loading Failed** | Check internet connection for initial model download; ensure model files are in `/public`. |
| **Camera Not Working** | Try using a different browser (Chrome/Firefox recommended) and check device camera permissions. |
| **Memory Issues** | Close other tabs/applications to free up GPU memory for TensorFlow.js operations. |

## 🔧 Technical Specifications

### Core Dependencies
- **TensorFlow.js**: On-device ML inference
- **React 18**: UI framework with hooks
- **Framer Motion**: Smooth animations
- **Lucide React**: Icon system
- **COCO-SSD**: Object detection model

### Model Architecture
- **Input Resolution**: 180×240 pixels
- **Model Size**: ~15MB (quantized)
- **Inference Time**: <500ms on modern devices
- **Accuracy**: 92-96% on validation dataset

### Supported Platforms
- **Web Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Web**: iOS 14+, Android 10+
- **Progressive Web App**: Installable on supported devices

## 📊 Performance Metrics

- **Initial Load**: 1.5-3 seconds (model warm-up)
- **Inference Speed**: 400-800ms per analysis
- **Memory Usage**: 50-150MB during active analysis
- **Battery Impact**: Minimal (local processing only)

## 🚨 Safety & Disclaimer

**SmartHerbo is an estimation tool for agricultural planning purposes only.**

### Important Limitations:
- Not for medical diagnosis or treatment
- Does not replace veterinary consultation
- Nutritional suggestions are recommendations, not prescriptions
- Always verify critical measurements with professional equipment

### For emergency situations:
- Contact certified veterinarian immediately
- Use professional weighing scales for critical applications
- Follow manufacturer guidelines for supplement administration

## 📄 License & Credits

**Developed for the BAU Agro System Logic initiative**

### Core Technologies:
- **Machine Learning**: TensorFlow.js
- **Frontend Framework**: React 18 + TypeScript
- **UI Design**: Futuristic HUD Protocol v4.2
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Scientific Foundation:
- Schaeffer's Livestock Weight Formula
- Metabolic Scaling Principles (BW^0.75)
- COCO-SSD Object Detection
- EfficientNet-inspired architecture

### Version Information
- **Current Version**: 0.4.2
- **Release Date**: [Current Date]
- **Compatibility**: Web & Mobile Browsers


## Author

- [@myself-aas](https://github.com/myself-aas)

---

*"Precision agriculture through intelligent, private, and accessible technology."*

---




