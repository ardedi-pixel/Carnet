# Vérifie quelles chaînes françaises n'ont pas de traduction (EN) ; affiche les manquantes
import os,sys
from pathlib import Path
DEV=Path(__file__).resolve().parents[1]
OUT=DEV/'tools'/'out';OUT.mkdir(exist_ok=True)
CHROME={'executable_path':'/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
sys.path.insert(0,str(DEV/'tools'))
import re,json,sys
s=open(str(DEV/'src'/'js'/'94_dict.js')).read()
dec=json.JSONDecoder()
en,_=dec.raw_decode(s,s.index('const DICT_EN=')+len('const DICT_EN='))
nl,_=dec.raw_decode(s,s.index('const DICT_NL=')+len('const DICT_NL='))
def norm(c):
    k=c.replace('{n}','').replace('{s}','')
    k=re.sub(r'\{[kgdt]\}','{0}',k)
    return re.sub(r'\d+(?:[.,]\d+)?','{0}',k)
def missing(cands):
    out=[]
    for c in cands:
        k=c.replace('{n}','').replace('{s}','');k2=norm(c)
        if k not in en and k2 not in en:out.append(c)
    return out
if __name__=='__main__':
    cands=json.load(open(sys.argv[1]))
    m=missing(cands);print(len(cands),'missing',len(m))
    for x in m:print(json.dumps(x,ensure_ascii=False))
