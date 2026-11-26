# Ajoute des traductions : extra.json (source) + ajout en fin de DICT_EN / DICT_NL dans 94_dict.js (sans retrier, diff minimal)
import os,sys
from pathlib import Path
DEV=Path(__file__).resolve().parents[1]
OUT=DEV/'tools'/'out';OUT.mkdir(exist_ok=True)
CHROME={'executable_path':'/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
sys.path.insert(0,str(DEV/'tools'))
import json,sys
D=str(DEV)
new=json.load(open(sys.argv[1],encoding='utf-8'))
x=json.load(open(D+'/i18n/extra.json',encoding='utf-8'))
p=D+'/src/js/94_dict.js';s=open(p,encoding='utf-8').read()
dec=json.JSONDecoder()
i0=s.index('const DICT_EN=')+len('const DICT_EN=');en,e1=dec.raw_decode(s,i0)
j0=s.index('const DICT_NL=')+len('const DICT_NL=');nl,e2=dec.raw_decode(s,j0)
addE=[(k,v[0]) for k,v in new.items() if k not in en];addN=[(k,v[1]) for k,v in new.items() if k not in nl]
for k,v in new.items():x[k]=v
json.dump(x,open(D+'/i18n/extra.json','w',encoding='utf-8'),ensure_ascii=False)
fmt=lambda L:''.join(','+json.dumps(k,ensure_ascii=False)+':'+json.dumps(v,ensure_ascii=False) for k,v in L)
# insérer avant l'accolade fermante de chaque objet (NL d'abord pour ne pas décaler les index de EN)
s=s[:e2-1]+fmt(addN)+s[e2-1:]
s=s[:e1-1]+fmt(addE)+s[e1-1:]
open(p,'w',encoding='utf-8').write(s)
print('EN +',len(addE),'NL +',len(addN))
