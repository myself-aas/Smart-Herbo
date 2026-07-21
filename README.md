# SmartHerbo Research Preview

SmartHerbo is a futuristic, privacy-first livestock management application designed for precision agriculture. It utilizes on-device Machine Learning (TensorFlow.js) to predict cattle weight and provide specialized nutritional requirements (specifically Plantain Herb supplements) based on metabolic scaling.

## Key Features

- **Hybrid Inference Engine**: Combines custom neural network inference with classical biometric formulas (Schaeffer's) to provide high-confidence weight estimations.

- **Vision Verification**: Integrated COCO-SSD object detection ensures that measurements are only processed if a bovine subject is detected in the frame, preventing data entry errors.

- **Metabolic Scaling**: Automatically calculates nutritional dosages (Plantain Herb) using metabolic scaling logic rather than simple linear weight-based scaling.

- **100% Privacy & Offline**: All AI processing happens locally on the device hardware. No images or biometric data are ever uploaded to a cloud server.

- **Futuristic HUD UI**: A high-contrast, dark-mode interface designed for high visibility in field environments with real-time feedback loops.

- **Cross-Platform Navigation**: Robust back button functionality with exit confirmation for both web and mobile platforms.

## Installation & Setup

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

## User Guide & Workflow

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

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Sensor Error** | Ensure camera permissions are granted in the browser settings. |
| **Stochastic Result** | Check if measurements were entered correctly (inches vs centimeters mismatch). |
| **Low Performance** | Enable "Hardware Acceleration" in browser settings and ensure WebGL is supported. |
| **Model Loading Failed** | Check internet connection for initial model download; ensure model files are in `/public`. |
| **Camera Not Working** | Try using a different browser (Chrome/Firefox recommended) and check device camera permissions. |
| **Memory Issues** | Close other tabs/applications to free up GPU memory for TensorFlow.js operations. |

## Technical Specifications

### Core Dependencies
- **TensorFlow.js**: On-device ML inference
- **React 18**: UI framework with hooks
- **Framer Motion**: Smooth animations
- **Lucide React**: Icon system
- **COCO-SSD**: Object detection model

### Supported Platforms
- **Web Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Web**: iOS 14+, Android 10+
- **Progressive Web App**: Installable on supported devices


## Safety & Disclaimer

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

### Core Technologies:
- **Machine Learning**: TensorFlow.js
- **Frontend Framework**: React 18 + TypeScript
- **UI Design**: Futuristic HUD Protocol v4.2
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Scientific Foundation:
- Schaeffer's Livestock Weight Formula
- Metabolic Scaling Principles 
- COCO-SSD Object Detection

### Version Information
- **Current Version**: 0.4.2
- **Release Date**: 01-28-2026
- **Compatibility**: Web & Mobile Browsers


## Author

<div align="center">

### Ashif Ahmed Shuvo
**Machine Learning Enthusiast · AI & Food Engineering Researcher**

*AI & ML expert with a B.Sc. in Food Engineering, specializing in precision and sustainable agriculture and agricultural automation. Experienced in computer vision for object detection & recognition, IoT-based smart farming solutions, and data-driven decision-making for monitoring and optimization. Passionate about integrating AI, remote sensing, and sensor-based technologies to enhance sustainable agriculture and horticulture research.*

---

[![GitHub](https://img.shields.io/badge/GitHub-myself--aas-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/myself-aas/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-me--aas-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/me-aas/)
[![Email](https://img.shields.io/badge/Email-shuvo.1807016@bau.edu.bd-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:shuvo.1807016@bau.edu.bd)
[![Phone](https://img.shields.io/badge/Phone-+8801985531180-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](tel:+8801985531180)

</div>

---

## Citation & Metadata

If you use **SmartHerbo** in your research, field studies, or agricultural monitoring, please cite the software as follows to ensure proper academic attribution:

### **APA 7**
> Shuvo, Ashif Ahmed. (2026). *SmartHerbo: A Privacy-First, On-Device Hybrid Neural-Biometric System for Precision Bovine Weight Estimation and Metabolic Nutritional Scaling* (Version 1.0.1) [software]. Github. [https://doi.org/10.5281/zenodo.19362813](https://doi.org/10.5281/zenodo.19362813)

### **BibTeX**
```bibtex
@software{aas_smartherbo_2026,
  author = {Shuvo, Ashif Ahmed},
  title = {SmartHerbo: A Privacy-First, On-Device Hybrid Neural-Biometric System for Precision Bovine Weight Estimation and Metabolic Nutritional Scaling},
  version = {1.0.1},
  year = {2026},
  month = {4},
  publisher = {Github},
  doi = {10.5281/zenodo.19362813},
  url = {https://github.com/myself-aas/Smart-Herbo},
  abstract = {SmartHerbo is a futuristic, privacy-first livestock management application designed for precision agriculture and metabolic nutritional scaling. Developed at Bangladesh Agricultural University (BAU), the platform utilizes a dual-stage, on-device machine learning pipeline powered by TensorFlow.js. It integrates COCO-SSD for real-time bovine subject verification with classical Schaeffer’s biometric formulas for weight estimation.},
  keywords = {Plantain Herb, Digital farming, Sustainable agriculture, Animal husbandry, Animal Feed, Animal Nutrition Sciences},
  language = {english},
  note = {Initial stable production release with Zenodo archival integration},
  copyright = {© 2026 Ashif Ahmed Shuvo. Licensed under the MIT License}
}
```

---

### **Repository Metadata Details**

| Field | Value |
| :--- | :--- |
| **Direct DOI (v1.0.1)** | [10.5281/zenodo.19362814](https://doi.org/10.5281/zenodo.19362814) |
| **Concept DOI (All Versions)** | [10.5281/zenodo.19362813](https://doi.org/10.5281/zenodo.19362813) |
| **Resource Type** | Software |
| **Software Heritage ID** | `swh:1:dir:285fcf3c63249f7e2f957e6275f35d29e047826f` |
| **Affiliation** | Bangladesh Agricultural University (BAU) |
| **License** | MIT License |

---

### **Abstract Summary**
SmartHerbo leverages **TensorFlow.js** for 100% offline, on-device inference to ensure total data privacy in field environments. By combining **COCO-SSD** computer vision with classical Schaeffer's biometric formulas, it provides high-accuracy cattle weight estimation. Furthermore, it moves beyond simple mass-based nutrition by applying **Metabolic Scaling Principles** to calculate precise bioactive dosages of **Plantain Herb** supplements.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

*Built with passion for food security research in Bangladesh*

</div>

---

*“This document is an internal pre-release research preview for SmartHerbo. It describes preliminary prototype findings and internal usability feedback, and is not peer-reviewed or published.”*
---

*“This document is an internal pre-release research preview for SmartHerbo. It describes preliminary prototype findings and internal usability feedback, and is not peer-reviewed or published.”*

