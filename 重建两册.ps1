$ErrorActionPreference = 'Stop'
$taskNode = 'C:/Users/Ming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$taskPython = 'C:/Users/Ming/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
$env:PYTHONIOENCODING = 'utf-8'
Push-Location -LiteralPath $PSScriptRoot
try {
    & $taskNode 'render_theory_html.cjs'
    if ($LASTEXITCODE -ne 0) { throw '理论HTML/PDF初次渲染失败' }
    & $taskNode 'render_practice_html.cjs'
    if ($LASTEXITCODE -ne 0) { throw '练习HTML/PDF初次渲染失败' }
    & $taskPython -u -X utf8 'check_pdf.py'
    if ($LASTEXITCODE -ne 0) { throw '页码检查失败' }
    & $taskNode 'sync_final_toc.cjs'
    if ($LASTEXITCODE -ne 0) { throw '目录同步失败' }
    & $taskPython -u -X utf8 'bookmark_pdfs.py'
    if ($LASTEXITCODE -ne 0) { throw '书签恢复失败' }
    & $taskNode '定稿打印版/多元配色修订版/colorize.cjs'
    if ($LASTEXITCODE -ne 0) { throw '多元配色修订版生成失败' }
    & $taskNode 'generate_all_schemes.cjs'
    if ($LASTEXITCODE -ne 0) { throw '三大配色生成失败' }
    & $taskPython -u -X utf8 '恢复全部方案书签.py'
    if ($LASTEXITCODE -ne 0) { throw '配色文字核对或书签恢复失败' }
    & $taskPython -u -X utf8 '核验精简项目.py'
    if ($LASTEXITCODE -ne 0) { throw '项目核验失败' }
    & $taskPython -u -X utf8 'final_pdf_audit.py'
    if ($LASTEXITCODE -ne 0) { throw 'PDF终审失败' }
} finally { Pop-Location }
