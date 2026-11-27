"""يعرض قائمة ملفات صوتية مرشحة من ويكيميديا كومنز (بدون تنزيل) لاختيار أنسبها."""
import json, urllib.parse, urllib.request, time
UA = {'User-Agent': 'MutawakelScreens/1.0 (kids game)'}
API = 'https://commons.wikimedia.org/w/api.php?'
for q in ['intitle:quack filetype:audio', 'intitle:quacking filetype:audio', 'intitle:duck filetype:audio', 'Hausente filetype:audio', 'domestic duck filetype:audio', 'intitle:meow filetype:audio', 'intitle:miaow filetype:audio']:
    u = API + urllib.parse.urlencode({'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6, 'gsrsearch': q, 'gsrlimit': 25,
        'prop': 'imageinfo|videoinfo', 'viprop': 'size|mime|url|derivatives', 'iiprop': 'size|mime|extmetadata', 'iiextmetadatafilter': 'LicenseShortName'})
    try:
        d = json.loads(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read())
    except Exception as e:
        print('ERR', q, e); continue
    print('== ' + q)
    for p in sorted(d.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 99)):
        ii = (p.get('imageinfo') or [{}])[0]
        print('  ', p['title'], '|', ii.get('size'), '|', ii.get('duration', ''), '|', ii.get('extmetadata', {}).get('LicenseShortName', {}).get('value', ''))
    time.sleep(3)
