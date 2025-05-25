{ pkgs, ... }:

{
  channel = "stable-24.05";

  packages = with pkgs; [
    nodejs_20
    nodePackages.pnpm
    nodePackages.firebase-tools
    typescript
    vite
    git
    direnv
  ];

  env = {
    NODE_ENV = "development";
  };

  idx.previews = {
    enable = true;
    previews = [
      {
        id      = "web";
        cwd     = "client";
        command = [
          "pnpm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      }
    ];
  };
}
