# Construit ../index.html (l'appli en un seul fichier) depuis dev/src. Lancer : python3 dev/build.py
import sys,os
H=os.path.dirname(os.path.abspath(__file__));D=H+'/src/'
R=lambda f:open(D+f,encoding='utf-8').read()
js=R('app.js')
mods=[R('js/'+f) for f in sorted(os.listdir(D+'js')) if f.endswith('.js')]
css=R('style.css')+''.join(R('css/'+f) for f in sorted(os.listdir(D+'css')) if f.endswith('.css'))
MARK='/*@@MODS@@*/'
assert MARK in js,'marker missing'
js=js.replace(MARK,'\n'.join(mods))
out=R('head.html')+'<style>'+css+R('body.html')+js+R('tail.html')
open(sys.argv[1] if len(sys.argv)>1 else os.path.join(H,'..','index.html'),'w',encoding='utf-8').write(out)
print('built',len(out))
