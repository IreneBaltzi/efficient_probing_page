import geopandas as gpd
import numpy as np
import cv2
import os
from rasterio.features import rasterize
from affine import Affine

# --------------------------------------------------
# CONFIG
# --------------------------------------------------

image_path = "F:/RsLab/Attentive_Probing/ICLR/efficient_probing_page/static/images/ep8_birds.png"
shp_path = "F:/RsLab/Attentive_Probing/ICLR/efficient_probing_page/static/images/masks_q8.shp"
output_dir = "F:/RsLab/Attentive_Probing/ICLR/efficient_probing_page/static/images/ep8_masks"
os.makedirs(output_dir, exist_ok=True)

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

# --------------------------------------------------
# LOAD IMAGE
# --------------------------------------------------

img = cv2.imread(image_path)
H, W, _ = img.shape

# --------------------------------------------------
# LOAD SHAPEFILE
# --------------------------------------------------

gdf = gpd.read_file(shp_path)

# Remove incorrect CRS (important!)
gdf = gdf.set_crs(None, allow_override=True)

print("Bounds:", gdf.total_bounds)
print("Image size:", W, H)

# --------------------------------------------------
# IMPORTANT: Affine transform for bottom-left origin
# --------------------------------------------------

transform = Affine(
    1, 0, 0,
    0, -1, H
)

# --------------------------------------------------
# GENERATE MASKS
# --------------------------------------------------

for q, rgb in query_colors.items():

    polygons = gdf[gdf["query_id"] == q].geometry
    polygons = polygons[polygons.notnull()]

    if len(polygons) == 0:
        print(f"No polygons found for query {q}")
        continue

    mask = rasterize(
        [(geom, 1) for geom in polygons],
        out_shape=(H, W),
        transform=transform,
        fill=0,
        dtype=np.uint8
    )

    # Create RGBA image
    rgba = np.zeros((H, W, 4), dtype=np.uint8)

    rgba[..., 0] = rgb[0]
    rgba[..., 1] = rgb[1]
    rgba[..., 2] = rgb[2]
    rgba[..., 3] = mask * 200  # alpha

    # Add outline
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    outline_color = (255, 255, 255, 255)  # white outline
    # outline_color = (0, 0, 0, 255)      # black alternative

    for contour in contours:
        cv2.drawContours(rgba, [contour], -1, outline_color, thickness=3)

    out_path = os.path.join(output_dir, f"ep8_q{q}.png")
    cv2.imwrite(out_path, cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

    print(f"Saved mask for query {q}")

print("All masks generated successfully.")
