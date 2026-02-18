import cv2
import numpy as np
import os

# === CONFIG ===
image_path = "F:/RsLab/Attentive_Probing/ICLR/efficient_probing_page/static/images/ep8_birds.png"
output_dir = "F:/RsLab/Attentive_Probing/ICLR/efficient_probing_page/static/images/ep8_masks"
os.makedirs(output_dir, exist_ok=True)

# Query RGB colors
query_colors = {
    1: (247,237,123),
    2: (244,181,110),
    3: (239,115,115),
    4: (125,164,242),
    5: (135,224,242),
    6: (124,239,143),
    7: (195,137,237),
    8: (244,146,195),
}

# Threshold (tune if needed)
COLOR_THRESHOLD = 40  # increase if masks too sparse

# === LOAD IMAGE ===
img_bgr = cv2.imread(image_path)
img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

H, W, _ = img_rgb.shape

for q, rgb in query_colors.items():

    color = np.array(rgb)

    # Compute Euclidean color distance
    dist = np.linalg.norm(img_rgb - color, axis=2)

    # Create binary mask
    binary_mask = (dist < COLOR_THRESHOLD).astype(np.uint8)

    # Smooth slightly (optional)
    binary_mask = cv2.GaussianBlur(binary_mask.astype(np.float32), (5,5), 0)
    binary_mask = (binary_mask > 0.2).astype(np.uint8)

    # Create colored RGBA
    rgba = np.zeros((H, W, 4), dtype=np.uint8)

    # Fill region with query color
    rgba[..., 0] = rgb[0]
    rgba[..., 1] = rgb[1]
    rgba[..., 2] = rgb[2]
    rgba[..., 3] = binary_mask * 200  # softer alpha

    # --- ADD OUTLINE ---
    contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Choose outline color (white or black)
    outline_color = (255, 255, 255, 255)  # white outline
    # outline_color = (0, 0, 0, 255)      # black outline

    # Draw outline on RGBA
    for contour in contours:
        cv2.drawContours(rgba, [contour], -1, outline_color, thickness=3)

    out_path = os.path.join(output_dir, f"ep8_q{q}.png")
    cv2.imwrite(out_path, cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

print("Masks generated successfully.")
