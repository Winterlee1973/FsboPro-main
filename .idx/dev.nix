{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # Build inputs are packages that are available during the build phase.
  # For a development shell, these are the tools you want available in your shell.
  buildInputs = with pkgs; [
    nodejs_20 # Specify Node.js version (e.g., 20.x)
    pnpm      # pnpm for package management
    drizzle-kit # For database operations
    typescript  # For TypeScript development
    vite        # For frontend development
    git         # Common version control tool
    direnv      # For managing environment variables
  ];

  # Define environment variables or shell hooks if needed
  shellHook = ''
    echo "Entering FsboPro development environment"
    # Optional: Add aliases or other setup commands
    # alias dev="pnpm dev"
    # Start the frontend development server in the background for web preview
    cd client && pnpm dev &
  '';

  # Optional: Set a specific Node.js version if needed, though nodejs_20 handles this.
  # NODE_OPTIONS = "--max-old-space-size=4096";
  # Configure web preview for the frontend
  webPreview = [
    {
      name = "FsboPro Frontend";
      port = 5173; # Default Vite port
      path = "./client"; # Path to the frontend directory
    }
  ];
}