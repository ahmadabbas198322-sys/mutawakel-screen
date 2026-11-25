"""يجلب أصوات حيوانات حقيقية من ويكيميديا كومنز (رخص حرة) وينطق الأسماء بصوت عربي.
يشتغل داخل GitHub Actions لأن الجهاز هناك متصل بالإنترنت."""
import json, os, subprocess, urllib.parse, urllib.request, asyncio, re
OUT = 'sighar/sounds'
os.makedirs(OUT + '/animals', exist_ok=True); os.makedirs(OUT + '/voice', exist_ok=True)
UA = {'User-Agent': 'MutawakelScreens/1.0 (kids game; github.com/ahmadabbas198322-sys)'}

import time
def get(url):
    for k in range(3):
        if time.time() - T0 > 1500: raise RuntimeError('time budget used')
        try:
            time.sleep(6)
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code != 429: raise
            print('429, waiting', flush=True); time.sleep(45)
    raise RuntimeError('rate limited')
T0 = time.time()
BAD = re.compile(r'^File:(En|De|LL-Q|Nl|Fr|Es|It|Pt|Ru|Sv)[-_ ]|Low.German|dialect|Rag|song|music|Michigan|Tools|shot|corner', re.I)

ANIMALS = {
 'cat': ['cat meow', 'Felis catus meow', 'meowing cat'],
 'dog': ['dog bark', 'dog barking', 'Canis familiaris bark'],
 'cow': ['cow moo', 'cow mooing', 'Bos taurus moo'],
 'sheep': ['sheep bleat', 'sheep baa', 'Ovis aries'],
 'duck': ['mallard quacking', 'duck quacking', 'female mallard quack', 'Anas platyrhynchos quack'],
 'rooster': ['rooster crowing', 'rooster crow', 'cock-a-doodle-doo'],
 'lion': ['Panthera leo roar', 'lion roar', 'lion roaring zoo', 'lion growl'],
 'elephant': ['elephant trumpet', 'elephant trumpeting', 'elephant call'],
 'horse': ['horse neigh', 'horse whinny', 'neighing'],
 'frog': ['frog croak', 'frog call', 'Rana croaking'],
 'bird': ['house sparrow song', 'sparrow chirp', 'bird chirping'],
 'chick': ['chick peeping', 'chicks peeping', 'chicken chick', 'baby chick'],
 'bee': ['bee buzzing', 'honey bee buzz', 'bees buzzing'],
 'camel': ['camel grunt', 'camel groaning', 'dromedary camel sound', 'camel noise'],
}
NEED = {'duck': r'quack', 'lion': r'lion|leo|roar', 'camel': r'camel|dromedar', 'chick': r'chick|poussin|kÃ¼ken|peep', 'cow': r'cow|moo', 'bird': r'sparrow|passer|bird', 'bee': r'bee|apis'}
API = 'https://commons.wikimedia.org/w/api.php?'
credits = json.load(open(OUT + '/animals/credits.json')) if os.path.exists(OUT + '/animals/credits.json') else {}
ONLY = os.environ.get('ONLY', 'duck').split(',')
for key, terms in ANIMALS.items():
    if key not in ONLY: continue
    got = len([f for f in os.listdir(OUT + '/animals') if f.startswith(key + '_')]); seen = {v['file'] for v in credits.values()}
    if got >= 1: continue
    got_target = 1
    for term in terms:
        if got >= 1: break
        q = API + urllib.parse.urlencode({'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6,
            'gsrsearch': term + ' filetype:audio', 'gsrlimit': 10, 'prop': 'imageinfo',
            'iiprop': 'url|size|mime|extmetadata', 'iiextmetadatafilter': 'LicenseShortName|Artist'})
        try: pages = json.loads(get(q)).get('query', {}).get('pages', {})
        except Exception as e: print('search fail', key, term, e); continue
        for p in sorted(pages.values(), key=lambda p: p.get('index', 99)):
            if got >= 1: break
            ii = (p.get('imageinfo') or [{}])[0]; t = p['title']
            if t in seen or BAD.search(t) or not re.search(NEED.get(key,'.'), t, re.I) or not ii.get('url') or ii.get('size', 9e9) > 8e6: continue
            seen.add(t)
            raw = f'/tmp/{key}_raw'
            try: open(raw, 'wb').write(get(ii['url']))
            except Exception as e: print('dl fail', t, e); continue
            dst = f'{OUT}/animals/{key}_{got+1}.mp3'
            # أعلى جزء صوتاً لمدة ٣ ثوان تقريباً، تلاشي، وتوحيد الارتفاع
            r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af',
                'silenceremove=start_periods=1:start_threshold=-40dB,atrim=0:3.2,afade=t=in:d=0.03,afade=t=out:st=2.8:d=0.4,loudnorm=I=-16:TP=-1.5',
                '-ac', '1', '-ar', '44100', '-b:a', '96k', dst])
            if r.returncode or not os.path.exists(dst) or os.path.getsize(dst) < 4000: continue
            md = ii.get('extmetadata', {})
            credits[os.path.basename(dst)] = {'file': t, 'url': ii.get('descriptionurl', ''),
                'license': md.get('LicenseShortName', {}).get('value', ''),
                'artist': re.sub('<[^>]+>', '', md.get('Artist', {}).get('value', ''))}
            got += 1; print('ok', dst, t, flush=True)
json.dump(credits, open(OUT + '/animals/credits.json', 'w'), ensure_ascii=False, indent=1)

# ---- نطق عربي ----
import edge_tts
PHRASES = {
 'n_cat': 'قِطَّة', 'n_dog': 'كَلْب', 'n_cow': 'بَقَرة', 'n_sheep': 'خَروف', 'n_duck': 'بَطَّة', 'n_rooster': 'دِيك',
 'n_lion': 'أَسَد', 'n_elephant': 'فِيل', 'n_horse': 'حِصان', 'n_frog': 'ضِفْدَع', 'n_bird': 'عُصْفور', 'n_chick': 'كَتْكوت',
 'n_bee': 'نَحْلة', 'n_camel': 'جَمَل',
 'yay1': 'أَحْسَنْتِ!', 'yay2': 'يا سَلام!', 'yay3': 'شاطْرة!', 'hello': 'هَيّا نَلْعَب!',
}
NUM = ['واحِد', 'اثْنان', 'ثَلاثة', 'أَرْبَعة', 'خَمْسة', 'سِتّة', 'سَبْعة', 'ثَمانِية', 'تِسْعة', 'عَشَرة']
for i, w in enumerate(NUM, 1): PHRASES[f'num{i}'] = w
LET = [('ألِف','أَرْنَب'),('باء','بَطَّة'),('تاء','تُفّاحة'),('ثاء','ثَعْلَب'),('جيم','جَمَل'),('حاء','حِصان'),('خاء','خَروف'),('دال','دَجاجة'),
 ('ذال','ذِئْب'),('راء','ريشة'),('زاي','زَرافة'),('سين','سَمَكة'),('شين','شَمْس'),('صاد','صَقْر'),('ضاد','ضِفْدَع'),('طاء','طائِرة'),
 ('ظاء','ظَرْف'),('عين','عِنَب'),('غين','غَيْمة'),('فاء','فيل'),('قاف','قِطَّة'),('كاف','كَلْب'),('لام','لَيْمون'),('ميم','مَوْز'),
 ('نون','نَحْلة'),('هاء','هَدِيّة'),('واو','وَرْدة'),('ياء','يَد')]
for i, (n, w) in enumerate(LET): PHRASES[f'let{i}'] = f'{n}... {w}'

async def tts():
    for k, text in PHRASES.items():
        if os.path.exists(f'{OUT}/voice/{k}.mp3'): continue
        for voice in ('ar-KW-NouraNeural', 'ar-SA-ZariyahNeural'):
            try:
                await edge_tts.Communicate(text, voice, rate='-12%', pitch='+8Hz').save(f'/tmp/{k}.mp3')
                subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'/tmp/{k}.mp3', '-af', 'loudnorm=I=-16:TP=-1.5',
                                '-ac', '1', '-b:a', '64k', f'{OUT}/voice/{k}.mp3'], check=True)
                print('voice', k, voice); break
            except Exception as e: print('tts fail', k, voice, e)
asyncio.run(tts())
