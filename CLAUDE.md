# CLAUDE.md

## パッケージ管理

このプロジェクトでは **uv** を用いてライブラリ（依存関係）を管理する。

- ライブラリの追加: `uv add <package>`
- 開発用ライブラリの追加: `uv add --dev <package>`
- ライブラリの削除: `uv remove <package>`
- 依存関係の同期: `uv sync`
- スクリプトの実行: `uv run <command>`

`pip install` や `python -m pip` は直接使用しないこと。依存関係は `pyproject.toml` と `uv.lock` で管理する。
