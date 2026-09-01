<?php
function e(?string $value): string { return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8'); }
function old(string $key): string { return e($_POST[$key] ?? ''); }
