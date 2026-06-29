# PUSAB Backend (Django + DRF)

REST API for the PUSAB website. The React frontend (in the repo root) consumes
this API. Images are uploaded directly from the browser to **Cloudinary**; the
API only stores the resulting image URLs.

## Stack
- **Django 5 + Django REST Framework** — API
- **SimpleJWT** — token auth (`is_staff` = admin)
- **PostgreSQL** in production (SQLite for local dev)
- **Cloudinary** — image hosting (frontend-side upload)
- **CORS** — allows the React app's origin

## Project layout
```
backend/
├── config/            # project: settings, urls, wsgi/asgi, permissions
├── accounts/          # custom email user + auth (register, me)
├── gallery/           # Moments photos
├── publicity/         # news / press / events
├── committee/         # Executive Committee members
├── programs/          # programs & events (computed status)
├── manage.py
└── requirements.txt
```

## Local setup
```bash
cd backend
python -m venv .venv
# Windows:  .venv\Scripts\activate
# macOS/Linux:  source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env          # then edit values
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser   # your admin login (is_staff=True)
python manage.py runserver
```
API runs at `http://127.0.0.1:8000/`.

## API endpoints
| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/token/` | public — get JWT (email + password) |
| POST | `/api/auth/token/refresh/` | public |
| POST | `/api/auth/register/` | public — create account |
| GET | `/api/auth/me/` | auth — current user + `is_admin` |
| GET/POST/PUT/DELETE | `/api/gallery/` | read public · write admin |
| GET/POST/PUT/DELETE | `/api/publicity/` | read public · write admin |
| GET/POST/PUT/DELETE | `/api/committee/` | read public · write admin |
| GET/POST/PUT/DELETE | `/api/programs/` | read public · write admin |

Filters: `/api/publicity/?type=news`, `/api/committee/?year=2026`,
`/api/committee/?current=true`, `/api/gallery/?category=events`.

Auth header for write requests: `Authorization: Bearer <access_token>`.

## Make a user an admin
Either create a superuser (above), or in the Django shell:
```bash
python manage.py shell -c "from accounts.models import User; u=User.objects.get(email='you@example.com'); u.is_staff=True; u.save()"
```

## Deploy (free options)
- **Render / Railway / PythonAnywhere** for the Django service.
- Set env vars: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `DATABASE_URL`
  (Postgres — Supabase/Neon also work as just the DB), `CORS_ALLOWED_ORIGINS`
  (your Netlify URL).
- Start command: `gunicorn config.wsgi`
- Run on deploy: `python manage.py migrate && python manage.py collectstatic --noinput`

> Note: free Python hosts often sleep on inactivity (cold starts). Static files
> are served via WhiteNoise; user images live on Cloudinary, not the server.
