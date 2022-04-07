{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = [
    # JS lang and dev tools
    pkgs.nodejs-17_x
    pkgs.yarn

    # Deploy tools
    # pkgs.netlify-cli (broken)

    # keep this line if you use bash
    # pkgs.bashInteractive
  ];

  PATH = "$(yarn bin):$PATH";
}
