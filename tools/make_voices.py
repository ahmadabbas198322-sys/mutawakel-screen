"""يولّد ملفات النطق العربي والإنجليزي للعبة مرح الصغار من tools/voices.json (يشتغل داخل GitHub Actions)."""
import json, os, subprocess, asyncio
import edge_tts
OUT = 'sighar/sounds/voice'; os.makedirs(OUT, exist_ok=True)
V = json.load(open('tools/voices.json', encoding='utf8'))
VOICES = {'ar': ['ar-KW-NouraNeural', 'ar-SA-ZariyahNeural'], 'en': ['en-US-AnaNeural', 'en-US-JennyNeural']}
async def main():
    for k, (lang, text) in V.items():
        dst = f'{OUT}/{k}.mp3'
        if os.path.exists(dst): continue
        for v in VOICES[lang]:
            try:
                await edge_tts.Communicate(text, v, rate='-10%' if lang == 'ar' else '-5%', pitch='+8Hz' if lang == 'ar' else '+0Hz').save('/tmp/v.mp3')
                subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/v.mp3', '-af', 'loudnorm=I=-16:TP=-1.5', '-ac', '1', '-b:a', '64k', dst], check=True)
                print('ok', k, v, flush=True); break
            except Exception as e: print('fail', k, v, e, flush=True)
asyncio.run(main())
