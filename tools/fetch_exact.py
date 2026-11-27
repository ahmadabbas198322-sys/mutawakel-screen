"""ينزّل ملفات صوت محددة بالاسم من ويكيميديا كومنز ويقصّها (يشتغل داخل GitHub Actions)."""
import json, os, re, subprocess, time, urllib.parse, urllib.request
UA = {'User-Agent': 'MutawakelScreens/1.0 (kids game)'}
OUT = 'sighar/sounds/animals'
PICK = {'cat_2.mp3': 'File:Meow.ogg', 'duck_1.mp3': 'File:Domestic duck sound 01.wav'}
cred_p = OUT + '/credits.json'; credits = json.load(open(cred_p, encoding='utf8'))
for dst, title in PICK.items():
    q = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({'action': 'query', 'format': 'json', 'titles': title, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiextmetadatafilter': 'LicenseShortName|Artist'})
    p = list(json.loads(urllib.request.urlopen(urllib.request.Request(q, headers=UA), timeout=60).read())['query']['pages'].values())[0]
    ii = p['imageinfo'][0]; time.sleep(5)
    for k in range(4):
        try: open('/tmp/raw', 'wb').write(urllib.request.urlopen(urllib.request.Request(ii['url'], headers=UA), timeout=60).read()); break
        except Exception as e: print('retry', e, flush=True); time.sleep(40)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/raw', '-af',
        'silenceremove=start_periods=1:start_threshold=-40dB,atrim=0:3.2,afade=t=in:d=0.03,afade=t=out:st=2.8:d=0.4,loudnorm=I=-16:TP=-1.5',
        '-ac', '1', '-ar', '44100', '-b:a', '96k', f'{OUT}/{dst}'], check=True)
    md = ii.get('extmetadata', {})
    credits[dst] = {'file': title, 'url': ii.get('descriptionurl', ''), 'license': md.get('LicenseShortName', {}).get('value', ''), 'artist': re.sub('<[^>]+>', '', md.get('Artist', {}).get('value', ''))}
    print('ok', dst, title, flush=True)
json.dump(credits, open(cred_p, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
