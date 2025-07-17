import os

# Dossier racine à analyser
ROOT = os.path.dirname(os.path.abspath(__file__))
EXTENSIONS = {'.ts', '.tsx'}
OUTPUT_FILE = os.path.join(ROOT, 'arborescence_ts_tsx_tree.txt')
EXCLUDE_DIRS = {'node_modules', '.git', '.vscode', '.idea', '.expo', '.qodo', '__pycache__'}

def build_tree(root):
    tree = {}
    for dirpath, dirnames, filenames in os.walk(root):
        # Exclure les dossiers système et node_modules
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        rel_dir = os.path.relpath(dirpath, root)
        if rel_dir == '.':
            rel_dir = ''
        for filename in filenames:
            if os.path.splitext(filename)[1] in EXTENSIONS:
                path_parts = rel_dir.split(os.sep) if rel_dir else []
                current = tree
                for part in path_parts:
                    current = current.setdefault(part, {})
                current.setdefault('__files__', []).append(filename)
    return tree

def print_tree(tree, prefix=''):
    lines = []
    for key in sorted(tree):
        if key == '__files__':
            for f in sorted(tree[key]):
                lines.append(f'{prefix}├── {f}')
        else:
            lines.append(f'{prefix}└── {key}/')
            lines.extend(print_tree(tree[key], prefix + '    '))
    return lines

def main():
    tree = build_tree(ROOT)
    lines = [os.path.basename(ROOT) + '/']
    lines.extend(print_tree(tree))
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f'Arborescence écrite dans {OUTPUT_FILE}')

if __name__ == '__main__':
    main()
