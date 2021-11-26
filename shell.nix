{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-16_x
    pkgs.yarn

    # keep this line if you use bash
    # pkgs.bashInteractive
  ];

  PATH = "$(yarn bin):$PATH";
}
