# SmartHerbo Pre-release Research Preview

## v1.1.3: Ethics-Aware Internal Research Preview
**Release Date:** 2026-05-15

> A privacy-first, offline-first hybrid biometric AI engine for precision livestock management. This pre-release brings SmartHerbo from prototype to edge-ready development with a novel hybrid inference architecture, metabolic dosage guidance, and preliminary usability validation.
>
> **Important:** This document describes internal research results and prototype findings. It is not a peer-reviewed publication and does not represent a published journal article.

---

## Highlights

- **HEART-Net Hybrid Edge Model**: Introduces the new Hyper-dimensional EinsteinNet Agricultural Translator for fast, high-confidence cattle weight prediction.
- **Multimodal Late Fusion**: Combines image-based CNN features with structured morphometric inputs (height, length, heart girth) for stronger field robustness.
- **100% Local Inference**: All model execution happens on-device in the browser using TensorFlow.js, with no cloud or external data transfer.
- **Metabolic Dose Guidance**: Converts weight predictions into Plantago lanceolata (plantain herb) dosage recommendations using metabolic scaling (W^0.75).
- **Preliminary Usability**: Based on an internal pilot usability study with farmers and extension workers.

---

## Release Summary

| Area | What’s New | Why it matters |
|---|---|---|
| Model | HEART-Net hybrid cognitive architecture | Compact footprint, efficient inference, strong predictive design |
| Deployment | TFJS float16 conversion + PWA offline cache | Works without internet; ideal for rural field deployment |
| Nutrition | Metabolic dosing for Plantain Herb | Precision supplement recommendation instead of simple weight-based dosing |
| Usability | Offline-first UI + object detection lock | Reduces measurement errors and improves farmer trust |

---

## Architecture & Model Improvements

### Multimodal Late Fusion
This release embeds a dual-input neural architecture:
- **Computer Vision branch**: Pre-trained CNN backbone for RGB cattle images.
- **Structured Data branch**: Dense regression head for height, length, and heart girth.
- **AdaptiveFusion layer**: Dynamically balances neural vision predictions with classical biometrics using uncertainty gating.

### HEART-Net Novelty
HEART-Net is designed for lightweight edge deployment with attention and adaptive fusion mechanisms.

---

## Performance Summary

This release note describes early internal performance evaluation, focusing on edge deployment readiness, local execution, and efficiency. Detailed numeric results are omitted in this preliminary summary.

### Edge Compliance Summary

SmartHerbo targets offline local execution, TensorFlow.js compatibility, and efficient browser deployment for field-oriented livestock analytics.

---

## Precision Nutrition Integration

SmartHerbo now includes metabolic dosage guidance for Plantago lanceolata supplements:
- Based on predicted weight and metabolic body weight calculated as $w^{0.75}$
- Uses a reference dosing equation: $D = (W^{0.75} / 53.18) × 50$
- Presented here as a conceptual guideline for internal research development


---


## Ethics & Research Status

- This release note summarizes **internal research and development status only**.
- The work is **not published** and has not been peer-reviewed.
- Claims are **preliminary** and intended for internal or project-level communication.
- No formal journal submission or publication is implied by this note.
- The content is presented with transparency and respect for research integrity, originality, and ethical reporting.

## Installation & Deployment Notes

### Install
```bash
npm install
```

### Run locally
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Required model assets
Place the following files in the `public/` or root model folder:
- `model.json`
- `group1-shard1of1.bin`
- `scaler_params.json`

---

## Privacy & Compliance

- **100% on-device inference**
- **No cloud image upload**
- **Biometric hashing and local caching**
- Designed for low-connectivity and privacy-sensitive agricultural applications

---

## Notes for the GitHub Release

This release note is tailored for GitHub and can be used directly in the release description. The results described here are based on internal development and preliminary evaluation; they do not represent a peer-reviewed or published article.

### Suggested tag
`v1.1.3`

### Suggested release title
`SmartHerbo v1.1.3 — Offline Hybrid AI for Field-Ready Livestock Analytics`

### Suggested release highlights
- `HEART-Net` edge-first hybrid model
- Offline TFJS browser deployment
- Metabolic Plantain Herb dosing calculator
- Preliminary usability feedback from an internal pilot
- Transparent pre-release research preview language
- Compact edge model design for browser deployment

---

## Related Resources

- `package.json` — current version metadata
- `README.md` — product overview and architecture
- `tfjsService.ts` — inference pipeline implementation
- `scaler_params.json` — model normalization constants

---

## Acknowledgements

Built by **Ashif Ahmed Shuvo**.

---

*“This document is an internal pre-release research preview for SmartHerbo. It describes preliminary prototype findings and internal usability feedback, and is not peer-reviewed or published.”*
