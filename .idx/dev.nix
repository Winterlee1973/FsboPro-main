{ pkgs, ... }: {
  channel = "stable-24.05";

  packages = with pkgs; [
    nodejs_20
    nodePackages.pnpm
    nodePackages.typescript
    git
  ];

  idx.previews = {
    enable = true;

    previews = {
      web = {
        command = [
          "pnpm" "run" "dev" "--"
          "--port" "$PORT"           # <- key change
          "--host" "0.0.0.0"
          "--disable-host-check"
        ];
        cwd = "client";
        manager = "web";
      };
    };
  };
}
