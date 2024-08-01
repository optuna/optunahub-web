import datetime
import os
import shutil

import frontmatter

from git import Repo


def main() -> None:
    repo = Repo("optunahub-registry")
    tree = repo.tree()

    package_dir = "package"
    registry_dir = f"optunahub-registry/{package_dir}"
    categories = ["samplers", "pruners", "visualization"]
    for c in categories:
        packages = os.listdir(f"{registry_dir}/{c}")
        for p in packages:
            hugo_dir = f"content/{c}/{p}"

            # Copy README.md and images
            os.makedirs(hugo_dir, exist_ok=True)
            imgdir = f"{registry_dir}/{c}/{p}/images"
            if os.path.exists(imgdir):
                shutil.copytree(imgdir, f"{hugo_dir}/images", dirs_exist_ok=True)

            # Read README.md and create index.md from it with modifications
            with open(f"{registry_dir}/{c}/{p}/README.md", "r") as readme_md:
                contents = frontmatter.load(readme_md)
                with open(f"{hugo_dir}/index.md", "w") as index_md:
                    # Last update for the package
                    updated_at_epoch = next(
                        repo.iter_commits(
                            paths=tree[f"{package_dir}/{c}/{p}"].path, max_count=1
                        )
                    ).committed_date
                    updated_at_iso = datetime.datetime.fromtimestamp(
                        updated_at_epoch
                    ).isoformat()
                    contents["updated_at"] = updated_at_iso
                    index_md.write(frontmatter.dumps(contents))


if __name__ == "__main__":
    main()
