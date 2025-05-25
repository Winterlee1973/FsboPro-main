{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    pnpm
    firebase-tools
    typescript
  ];

  shellHook = ''
    echo "Entering Nix development shell..."
    echo "Node.js version: $(node -v)"
    echo "pnpm version: $(pnpm -v)"
    echo "Firebase CLI version: $(firebase --version)"
    echo "TypeScript version: $(tsc -v)"
  '';
}
