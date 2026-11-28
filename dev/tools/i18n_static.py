# Vérifie dans le CODE que chaque texte affiché a sa traduction EN et NL (v7.6).
#   python3 dev/tools/i18n_static.py                 -> liste les textes complets sans traduction
#   python3 dev/tools/i18n_static.py --frag          -> ajoute les morceaux de phrase (texte collé à une variable)
#   python3 dev/tools/i18n_static.py --json f.json   -> écrit {texte: ""} pour les textes manquants (à traduire puis i18n_set.py)
# Complète i18n_full.py (parcours de l'appli) : ici on lit toutes les chaînes du code, même celles d'écrans rarement ouverts.
# Le code est lu sans l'exécuter : commentaires et expressions régulières sont sautés ; dans une chaîne qui contient
# du HTML, seuls les textes entre balises et les attributs placeholder / aria-label / title / alt sont vérifiés.
import re,json,sys
from pathlib import Path
DEV=Path(__file__).resolve().parents[1];SRC=DEV/'src'
FILES=[SRC/'app.js']+sorted(p for p in (SRC/'js').glob('*.js') if p.name not in ('94_dict.js',))
def load_dict():
    s=open(SRC/'js'/'94_dict.js',encoding='utf-8').read();dec=json.JSONDecoder()
    i0=s.index('const DICT_EN=')+len('const DICT_EN=');en,_=dec.raw_decode(s,i0)
    j0=s.index('const DICT_NL=')+len('const DICT_NL=');nl,_=dec.raw_decode(s,j0)
    return en,nl
KW={'return','typeof','case','in','of','new','delete','void','throw','else','do','instanceof'}
def literals(src):
    """(début, fin, valeur brute) de chaque chaîne '...' ou "..." du code"""
    out=[];i=0;n=len(src);prev='';pw=''
    while i<n:
        c=src[i]
        if c in ' \t\r\n':i+=1;continue
        if c=='/' and src[i+1:i+2]=='/':j=src.find('\n',i);i=n if j<0 else j;continue
        if c=='/' and src[i+1:i+2]=='*':j=src.find('*/',i+2);i=n if j<0 else j+2;continue
        if c in '\'"':
            j=i+1
            while j<n and src[j]!=c:
                if src[j]=='\\':j+=2;continue
                if src[j]=='\n':break
                j+=1
            out.append((i,j+1,src[i+1:j]));i=j+1;prev='"';pw='';continue
        if c=='/' and (prev=='' or prev in '(,=:[!&|?{};+-*%<>~^' or pw in KW):
            j=i+1;cls=False
            while j<n:
                ch=src[j]
                if ch=='\\':j+=2;continue
                if ch=='[':cls=True
                elif ch==']':cls=False
                elif ch=='/' and not cls:break
                elif ch=='\n':break
                j+=1
            j+=1
            while j<n and src[j].isalpha():j+=1
            i=j;prev='/';pw='';continue
        if c.isalnum() or c in '_$':
            j=i
            while j<n and (src[j].isalnum() or src[j] in '_$'):j+=1
            pw=src[i:j];prev='a' if pw not in KW else '(';i=j;continue
        prev=c;pw='';i+=1
    return out
ESC={'n':'\n','t':'\t','r':'','\\':'\\',"'":"'",'"':'"','0':'\0','b':'','f':'','v':''}
def unesc(s):
    def f(m):
        x=m.group(1)
        if x[0]=='u':return chr(int(x[1:5],16))
        if x[0]=='x':return chr(int(x[1:3],16))
        return ESC.get(x[0],x[0])
    return re.sub(r'\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)',f,s)
ATTR=re.compile(r'\b(placeholder|aria-label|title|alt)="([^"<>]*)"')
def segments(v):
    """[(texte, ouvert_gauche, ouvert_droite)] : un côté « ouvert » touche le bord de la chaîne sans balise entre les deux"""
    out=[]
    for m in ATTR.finditer(v):out.append((m.group(2),False,False))
    if not re.search(r'<[a-zA-Z/!]|^[^<]*["\']\s*/?>',v):return [(v,True,True)]
    s=v;lt=False;rt=False
    g=s.find('>');l=s.find('<')
    if g!=-1 and (l==-1 or g<l):s=s[g+1:];lt=True
    l=s.rfind('<');g=s.rfind('>')
    if l!=-1 and l>g:s=s[:l];rt=True
    parts=re.split(r'<[^>]*>',s)
    for k,p in enumerate(parts):
        out.append((p,k==0 and not lt,k==len(parts)-1 and not rt))
    return out
CODE=re.compile(r'^[#.\[]|data-|https?:|\.(html|js|png|jpg|json|svg|css|ics)\b|=>|&&|\|\||\(\)|^[\w-]+:\S|;\s*[\w-]+:|^[A-Z]?[\d\s.,MLHVCSQTAZmlhvcsqtaz-]+$')
# Code mort (compétition de l'époque claude.ai, jamais affichée : vCo toujours masqué) et textes propres à une langue : ignorés
IGN=re.compile(r"Personne n'a encore de séance cette semaine|compétition|Compétition|claude\.ai|compte Claude|Tes compétitions|Premier à 5 points|Gagné par|ton adversaire|Personne n'a encore rejoint|Égalité|Tu mènes|mène\. À toi|Séances cette semaine\.|Copier le code|^Quitter$|^Actualiser$|^Membre$|^Code :|Impossible de partager tes scores|Sur l'année · séances par mois|Le premier mois n'est pas encore|Aucune compétition|Crée-en une|^Cette semaine$|Créée ! Envoie|Le code fait 12|Rejoint\. Le créateur|Hors ligne : enregistré|synchronisation dès que possible|Three, two|Drie, twee|Trois, deux|^Language: |^Taal: ")
# Morceaux vérifiés dans l'appli (phrase complète, modèle {*} ou clé avec nombres) : voir trtest dans dev/PLAN.md v7.6
SKIP_FRAG={', séance','secondes de','· réussi !','sans OFF',"Fin de l'échauffement à",'Fin du repos à','Modifier ·','· filtre actif','Pyramide ·','· rang maximum, respect ! 👑','Séance dupliquée le','· répétitions','· secondes'}
SKIP={'Content-Type','AbortError','MacIntel','Escape','Enter','Firefox','Edge','Samsung Internet','Safari','Chrome','Zoom','Notification','Archivo','Inter','Helvetica'}
FRW=re.compile(r"\b(de|la|le|les|des|du|et|ou|en|au|aux|sans|avec|pour|par|sur|un|une|ton|ta|tes|mon|ma|mes)\b")
def is_ui(t):
    if len(t)<2 or not re.search(r'[A-Za-zÀ-ÿ]{2}',t):return False
    if t in SKIP or t in SKIP_FRAG or CODE.search(t) or IGN.search(t):return False
    if re.search(r'gradient\(|rgba?\(|cubic-bezier|sans-serif|system-ui|<<|%PDF|\d(px|s|ms|%)\b',t):return False
    if re.fullmatch(r'[a-z0-9 _-]+',t) and not FRW.search(t):return False  # liste de classes CSS
    if re.fullmatch(r'[a-z][\w-]*',t):return False      # identifiant ou mot isolé en minuscules : vérifié par le parcours
    if re.fullmatch(r'[\w-]+(\s+[\w-]+)*',t) and not re.search(r'[A-ZÀ-ÿ]',t) and ' ' not in t:return False
    return bool(re.search(r'[À-ÿœŒ’]',t) or re.search(r'[A-Za-z]{3,}\s+\S',t) or re.match(r'[A-ZÀ-Ý][a-zà-ÿ]{2,}',t))
EMO=re.compile('[\U0001F000-\U0001FAFF\u2600-\u27BF\uFE0F\u200D\u2190-\u21FF\u2B00-\u2BFF]')
def no_emo(t):return re.sub(r'\s{2,}',' ',EMO.sub('',t)).strip()
def shaped(t,name='Diego'):
    ks=[]
    for nm in (False,True):
        k=t
        if nm:
            if name not in k:continue
            k=k.replace(name,'\x01')
        i=[0]
        def num(m):
            r='{%d}'%i[0];i[0]+=1;return r
        k=re.sub(r'\d+(?:[.,]\d+)?',num,k).replace('\x01','{N0}')
        ks.append(k)
    return ks
def wild_res(D):
    res=[]
    for k in D:
        if '{*}' in k:
            p=re.escape(k).replace(r'\{\*\}',r'([\s\S]+?)')
            p=re.sub(r'\\\{\d+\\\}',r'(\\d+(?:[.,]\\d+)?)',p)
            res.append(re.compile('^'+p+'$'))
    return res
NE={}
def found(t,D,W):
    c=t.strip();ne=NE.setdefault(id(D),{no_emo(k) for k in D})
    for x in (c,no_emo(c)):
        if not x:return True
        if x in D or x in ne:return True
        for k in shaped(x):
            if k in D or k in ne:return True
        for r in W:
            m=r.match(x)
            if m and all(found(g,D,W) or not is_ui(g.strip()) for g in m.groups() if not re.fullmatch(r'\d+(?:[.,]\d+)?',g)):return True
    return False
def variants(v):
    if not re.search(r'\{[nkgdts]\}',v):return v.split('|') if '|' in v and '<' not in v else [v]
    out=[]
    for n in ('',' Diego'):
        for k in (1,3):
            x=v.replace('{n}',n)
            for c in 'kgd':x=x.replace('{'+c+'}',str(k))
            x=x.replace('{s}','s' if k>1 else '').replace('{t}','1 h 35')
            out.extend(x.split('|'))
    return list(dict.fromkeys(out))
def scan(frag=False):
    en,nl=load_dict();W=wild_res(en);miss={}
    for f in FILES:
        src=open(f,encoding='utf-8').read()
        for a,b,raw in literals(src):
            v=unesc(raw)
            j=b
            while j<len(src) and src[j] in ' \t':j+=1
            right=src[j:j+1]=='+' and src[j:j+2]!='++'
            j=a-1
            while j>=0 and src[j] in ' \t':j-=1
            left=j>=0 and src[j]=='+' and src[j-1:j+1]!='++'
            for t,lo,ro in [sg for vv in variants(v) for sg in segments(vv)]:
                tt=t.strip()
                if not is_ui(tt):continue
                isfrag=(lo and left and t[:1] in ' :,') or (ro and right and t[-1:] in ' :,(') or (lo and left and not t[:1].isupper()) or (ro and right)
                if isfrag and not frag:continue
                if found(tt,en,W) and found(tt,nl,wild_res(nl) if W else []):continue
                line=src.count('\n',0,a)+1
                miss.setdefault(tt,[]).append((f.name,line,'morceau' if isfrag else 'complet'))
    return miss
if __name__=='__main__':
    frag='--frag' in sys.argv
    miss=scan(frag)
    full={k:v for k,v in miss.items() if any(x[2]=='complet' for x in v)}
    part={k:v for k,v in miss.items() if k not in full}
    for title,grp in (('Textes complets sans traduction',full),('Morceaux de phrase (collés à une variable)',part)):
        if not grp:continue
        print('==',title,len(grp))
        for k,v in sorted(grp.items(),key=lambda x:(x[1][0][0],x[1][0][1])):print('  %s:%d  %r'%(v[0][0],v[0][1],k))
    if '--json' in sys.argv:
        out=sys.argv[sys.argv.index('--json')+1];json.dump({k:'' for k in miss},open(out,'w',encoding='utf-8'),ensure_ascii=False,indent=0)
    print('total',len(miss))
