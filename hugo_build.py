import os
import shutil


def main():
    registry_dir = "optunahub-registry/package"
    categories = ["samplers", "visualization"]
    for c in categories:
        packages = os.listdir(f"{registry_dir}/{c}")
        for p in packages:
            hugo_dir = f"content/{c}_{p}"
            os.makedirs(hugo_dir, exist_ok=True)
            shutil.copy(f"{registry_dir}/{c}/{p}/README.md", f"{hugo_dir}/index.md")
            imgdir = f"{registry_dir}/{c}/{p}/images"
            if os.path.exists(imgdir):
                shutil.copytree(imgdir, f"{hugo_dir}/images", dirs_exist_ok=True)


if __name__ == "__main__":
    main()
