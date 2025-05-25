{ pkgs, ... }: {
  channel = "stable-24.05";

  packages = with pkgs; [
    nodejs_20
    nodePackages.pnpm
    nodePackages.firebase-tools
    nodePackages.typescript
    git
  ];}