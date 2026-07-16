The assets folder is now included and visible in GitHub.

GitHub does not preserve empty folders. The earlier ZIP contained empty asset folders,
so they did not appear after upload.

This was not the cause of deployment failure. Build 1 does not yet require external
audio or image files because it uses CSS, emoji graphics, and Web Audio.
