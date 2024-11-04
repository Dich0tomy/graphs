{
  description = "Description for the project";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" ];
      perSystem = { pkgs, system, ... }: {
      	devShells.default = pkgs.mkShell {
					packages = [
						pkgs.typescript-language-server

            (pkgs.writeShellApplication {
              name = "run-server";

              runtimeInputs = [
								(pkgs.python311.withPackages(ps: [ ps.httpserver ]))
              ];

              text = ''
								python3 -m http.server
              '';
            })
					];
				};
      };
    };
}
