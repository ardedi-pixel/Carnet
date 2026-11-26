# Remplace (ou ajoute) des traductions existantes : python3 i18n_set.py fichier.json  (format {FR:[EN,NL]})
import os,sys
from pathlib import Path
DEV=Path(__file__).resolve().parents[1]
OUT=DEV/'tools'/'out';OUT.mkdir(exist_ok=True)
CHROME={'executable_path':'/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
sys.path.insert(0,str(DEV/'tools'))
import json,sys
D=str(DEV)
new=json.load(open(sys.argv[1],encoding='utf-8'))
p=D+'/src/js/94_dict.js';s=open(p,encoding='utf-8').read()
dec=json.JSONDecoder()
def objs(s):
    i0=s.index('const DICT_EN=')+len('const DICT_EN=');en,e1=dec.raw_decode(s,i0)
    j0=s.index('const DICT_NL=')+len('const DICT_NL=');nl,e2=dec.raw_decode(s,j0)
    return en,i0,e1,nl,j0,e2
J=lambda x:json.dumps(x,ensure_ascii=False)
rep=add=0
for k,(ve,vn) in new.items():
    for li,v in ((0,ve),(1,vn)):
        en,i0,e1,nl,j0,e2=objs(s);d,a,b=(en,i0,e1) if li==0 else (nl,j0,e2)
        if k in d:
            if d[k]==v:continue
            old=J(k)+':'+J(d[k]);seg=s[a:b]
            if seg.count(old)!=1:print('SKIP (encodage)',k);continue
            s=s[:a]+seg.replace(old,J(k)+':'+J(v))+s[b:];rep+=1
        else:
            s=s[:b-1]+','+J(k)+':'+J(v)+s[b-1:];add+=1
open(p,'w',encoding='utf-8').write(s)
x=json.load(open(D+'/i18n/extra.json',encoding='utf-8'))
for k,v in new.items():x[k]=v
json.dump(x,open(D+'/i18n/extra.json','w',encoding='utf-8'),ensure_ascii=False)
print('remplacées',rep,'ajoutées',add)
