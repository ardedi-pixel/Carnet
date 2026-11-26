/* ===================== v6 : messages selon le ton choisi (P13) ===================== */
/* {n} prénom (avec espace devant), {k} nombre, {g} séances restantes, {d} jours, {s} pluriel */
const MSG={
 motiv:{
  first:[['👋','Bienvenue{n} !','Note ta première séance après ton entraînement. C\'est parti ! 💪']],
  back:[['👋','Bon retour{n} !','Ça fait {d} jours… On s\'y remet ? 💪']],
  month:[['🚀','Nouveau mois{n} !','C\'est le moment de faire ton test max du mois ! 📈']],
  streak:[['🔥','Bon retour{n} !','{k} semaines d\'affilée, ne lâche rien ! 🔥']],
  goalDone:[['🏆','Salut{n} !','Objectif de la semaine déjà atteint, bravo ! 🙌']],
  goalLeft:[['💪','Bon retour{n} !','Encore {g} séance{s} pour ton objectif de la semaine !']],
  morning:[['☀️','Bonjour{n} !','Belle journée pour s\'entraîner ! 😄']],
  evening:[['🌙','Bonsoir{n} !','Une petite séance ce soir ? 😉']],
  generic:[['😄','Content de te revoir{n} !','Prêt à tout donner aujourd\'hui ? 💥'],['🙌','Bon retour{n} !','Chaque séance compte, continue comme ça !']],
  hDone:['Séance notée aujourd\'hui, bravo ! 💪','Déjà fait pour aujourd\'hui, bien joué ! 🔥'],
  hRest:['Jour de repos : tes muscles se reconstruisent. 😴'],
  hNew:['Nouvelle semaine, nouveau départ ! 🚀'],
  hLeft:['Plus que {g} séance{s} pour ton objectif ! 💪'],
  hGoal:['Objectif de la semaine atteint, bravo ! 🏆'],
  hGap:['Dernière séance il y a {d} jours. On s\'y remet ? 💪'],
  aGoal:['Objectif atteint ! 🎯'],aBadge:['Nouveau badge ! 🏅'],aRun:['{k} jours d\'affilée ! 🔥|Pense à t\'accorder un jour de repos, tu l\'as mérité 😴'],
  aWeek:['Objectif de la semaine atteint ! 🏆|{k} séance{s} cette semaine, bravo !'],aBack:['Content de te revoir ! 👋|Première séance depuis {d} jours, c\'est reparti !'],
  aFirst:['C\'est parti pour la semaine ! 🚀|Plus que {g} pour atteindre ton objectif !','Première de la semaine ! 💥|Plus que {g} pour atteindre ton objectif !'],
  aTop:['Quelle forme ! 🔥|Profite de cette énergie !','Tu es en feu ! 🔥|Profite de cette énergie !'],aBof:['Respect ! 👊|Même un jour bof, tu y es allé !'],
  aLong:['Grosse séance ! 💥|{t} d\'entraînement !'],aMorn:['Lève-tôt ! ☀️|La journée commence fort !','Séance du matin, bien joué ! ☀️|La journée commence fort !'],
  aLeft:['Bien joué ! 💪|Plus que {g} pour ton objectif de la semaine !','Encore une ! 🙌|Plus que {g} pour ton objectif de la semaine !'],
  aStreak:['{k} semaines d\'affilée ! 🔥|Continue sur ta lancée !','{k} semaines d\'affilée ! 🔥|La régularité paie !'],
  aGen:['Séance ajoutée ! ✅|Continue comme ça !','Bien joué ! 💪|Chaque séance compte !','Rien ne t\'arrête ! ⚡|Ton futur toi te remercie !'],
  mDone:['Bien joué aujourd\'hui ! 💪','Tu as assuré ! 🔥'],mSleep:['Chut… je récupère. 😴'],mWave:['Salut{n} ! Prêt pour aujourd\'hui ? 👋'],mIdle:['On s\'entraîne quand tu veux ! 💪','Une petite séance ? 😉'],mCheer:['Objectif de la semaine atteint ! 🏆'],mFlex:['Nouveau record ! Regarde-moi ces bras ! 💪']},
 cool:{
  first:[['👋','Salut{n}','Note ta première séance quand tu veux, sans pression. 🙂']],
  back:[['🌿','Te revoilà{n}','{d} jours de pause, c\'est ok. On reprend en douceur ?']],
  month:[['🗓️','Nouveau mois{n}','Si tu as le temps, un petit test max du mois ? 🙂']],
  streak:[['🌱','Salut{n}','{k} semaines d\'affilée, tranquillement mais sûrement.']],
  goalDone:[['😌','Salut{n}','Objectif de la semaine atteint. Tu peux souffler.']],
  goalLeft:[['🙂','Salut{n}','Encore {g} séance{s} cette semaine, à ton rythme.']],
  morning:[['☕','Bonjour{n}','Bonne journée. Une séance si l\'envie est là.']],
  evening:[['🌙','Bonsoir{n}','Séance légère ou repos ce soir, tu choisis.']],
  generic:[['🙂','Salut{n}','Content de te revoir. On fait quoi aujourd\'hui ?']],
  hDone:['Séance faite aujourd\'hui. Profite du reste de la journée. 😌'],hRest:['Repos aujourd\'hui. Ça compte aussi. 🌿'],hNew:['Nouvelle semaine, on y va doucement. 🙂'],
  hLeft:['Encore {g} séance{s} cette semaine, à ton rythme.'],hGoal:['Objectif atteint, tu peux souffler. 😌'],hGap:['Dernière séance il y a {d} jours. Quand tu veux. 🙂'],
  aGoal:['Objectif atteint 🙂'],aBadge:['Un nouveau badge 🏅'],aRun:['{k} jours d\'affilée|Un jour de repos te fera du bien. 😌'],aWeek:['Objectif de la semaine atteint|{k} séance{s}, c\'est très bien.'],
  aBack:['Te revoilà 🙂|Première séance depuis {d} jours, tranquille.'],aFirst:['Première de la semaine|Encore {g} quand tu veux.'],aTop:['Belle énergie aujourd\'hui|Garde ce rythme.'],aBof:['Tu y es allé quand même|C\'est ça qui compte. 🙂'],
  aLong:['Belle séance|{t}, prends le temps de récupérer.'],aMorn:['Séance du matin ☕|Bonne journée !'],aLeft:['Séance notée|Encore {g} cette semaine, à ton rythme.'],aStreak:['{k} semaines d\'affilée|Tranquillement mais sûrement.'],
  aGen:['Séance notée 🙂|Bien joué.','C\'est noté|Tu avances, tranquillement.'],
  mDone:['C\'est fait pour aujourd\'hui. 😌'],mSleep:['Je fais une petite sieste… 😴'],mWave:['Salut{n} 🙂'],mIdle:['Quand tu veux. 🙂'],mCheer:['Objectif atteint, bravo. 😌'],mFlex:['Un record, sympa ! 🙂']},
 coach:{
  first:[['📋','Au boulot{n}.','Première séance à noter. Pas d\'excuses.']],
  back:[['⏱️','{d} jours sans séance{n}.','On reprend aujourd\'hui. Pas demain.']],
  month:[['📈','Nouveau mois.','Test max cette semaine. On mesure, on progresse.']],
  streak:[['🔥','{k} semaines d\'affilée.','Bien. Ne relâche pas maintenant.']],
  goalDone:[['✅','Objectif de la semaine rempli.','Bien. La semaine prochaine, on vise plus haut.']],
  goalLeft:[['📋','Il reste {g} séance{s}.','Tu sais ce qu\'il te reste à faire.']],
  morning:[['☀️','Debout{n}.','La séance ne va pas se faire toute seule.']],
  evening:[['🌙','Il est encore temps{n}.','Une séance ce soir, et tu dors fier.']],
  generic:[['💪','On y va{n}.','Chaque séance compte. Aucune n\'est facultative.']],
  hDone:['Séance faite. Récupère bien, demain on remet ça.'],hRest:['Repos aujourd\'hui. Mange, dors, récupère.'],hNew:['Nouvelle semaine. Objectif : {k} séances. Au travail.'],
  hLeft:['Il reste {g} séance{s}. Pas de négociation.'],hGoal:['Objectif rempli. Maintenant, la qualité.'],hGap:['{d} jours sans séance. Ça suffit, on y retourne.'],
  aGoal:['Objectif atteint. Suivant.'],aBadge:['Badge débloqué.'],aRun:['{k} jours d\'affilée.|Demain : repos obligatoire.'],aWeek:['Objectif de la semaine rempli.|{k} séance{s}. Maintenant, on maintient.'],
  aBack:['Enfin.|{d} jours d\'absence. On ne recommence pas.'],aFirst:['Première de la semaine.|Encore {g}. Ne traîne pas.'],aTop:['Bonne séance.|Tu vois ce que tu peux faire.'],aBof:['Séance faite malgré tout.|C\'est comme ça qu\'on progresse.'],
  aLong:['{t} d\'effort.|Récupère sérieusement.'],aMorn:['Séance du matin.|Discipline.'],aLeft:['Séance notée.|Encore {g}. Pas d\'excuses.'],aStreak:['{k} semaines d\'affilée.|Continue. Pas de relâchement.'],
  aGen:['Séance notée.|Demain, on remet ça.','C\'est noté.|La régularité fait la différence.'],
  mDone:['Fait. Maintenant, récupération.'],mSleep:['Récupération en cours.'],mWave:['Prêt{n} ? On y va.'],mIdle:['Qu\'est-ce que tu attends ?'],mCheer:['Objectif rempli. Bien.'],mFlex:['Record. Prochain objectif.']},
 fun:{
  first:[['🦖','Bienvenue{n} !','Ton carnet est vide comme un frigo un dimanche soir. On le remplit ? 😄']],
  back:[['👻','Tiens, un revenant{n} !','{d} jours… tes haltères ont lancé un avis de recherche. 😅']],
  month:[['🎉','Nouveau mois{n} !','Le test max t\'attend. Il a même mis sa plus belle chemise. 📈']],
  streak:[['🔥','{k} semaines d\'affilée{n} !','À ce rythme, même ton canapé ne te reconnaît plus. 😎']],
  goalDone:[['🏆','Objectif atteint{n} !','Tu peux te la raconter un peu. Juste un peu. 😏']],
  goalLeft:[['💪','Salut{n} !','Encore {g} séance{s} et tu pourras frimer légalement.']],
  morning:[['☀️','Bonjour{n} !','Le café est prêt, tes muscles aussi. Enfin, presque. ☕']],
  evening:[['🌙','Bonsoir{n} !','Petite séance ou série Netflix ? Pourquoi pas les deux. 😄']],
  generic:[['😄','Te revoilà{n} !','Tes muscles t\'ont envoyé un message : ils s\'ennuient.'],['🤸','Salut{n} !','Prêt à transpirer plus que d\'habitude ?']],
  hDone:['Séance faite ! Tu as le droit de marcher au ralenti. 😎'],hRest:['Repos : même les super-héros font la sieste. 😴'],hNew:['Nouvelle semaine ! Les compteurs sont remis à zéro, pas tes biceps. 💪'],
  hLeft:['Encore {g} séance{s} et tu deviens une légende (locale).'],hGoal:['Objectif atteint ! Ton canapé est jaloux. 🛋️'],hGap:['{d} jours sans séance… tes baskets s\'inquiètent. 👟'],
  aGoal:['Objectif atteint ! 🎯'],aBadge:['Nouveau badge ! Accroche-le au frigo. 🏅'],aRun:['{k} jours d\'affilée ! 🔥|Même les robots se reposent. Pense à un jour off. 🤖'],
  aWeek:['Objectif de la semaine ! 🏆|{k} séance{s}. Le canapé porte plainte.'],aBack:['Le retour du roi ! 👑|{d} jours d\'absence, on va dire que c\'était des vacances.'],
  aFirst:['Première de la semaine ! 🚀|Plus que {g}. Facile. Enfin, presque.'],aTop:['Tu es en feu ! 🔥|Appelle les pompiers.'],aBof:['Séance bof, mais séance quand même ! 👊|Les jours bof comptent double. (C\'est faux, mais c\'est gentil.)'],
  aLong:['{t} ! 💥|Tu as fini par habiter à la salle ?'],aMorn:['Lève-tôt ! ☀️|Même le soleil est impressionné.'],aLeft:['Une de plus ! 🙌|Encore {g} et c\'est la gloire.'],aStreak:['{k} semaines d\'affilée ! 🔥|Ta régularité fait peur.'],
  aGen:['Séance ajoutée ! ✅|Tes muscles disent merci (et aïe).','Bien joué ! 💪|Ton futur toi te fait un high five.'],
  mDone:['Séance faite ! Je peux reprendre ma sieste ? 😄'],mSleep:['Zzz… je rêve de protéines. 😴'],mWave:['Coucou{n} ! On soulève des trucs ? 👋'],mIdle:['Allez, un petit effort, je t\'encourage ! 📣'],mCheer:['Objectif atteint ! On danse ? 💃'],mFlex:['Record ! Regarde ces biceps ! 💪']}
};
function msgFill(t,o){o=o||{};const n=shownName();return emo(String(t).replace(/\{n\}/g,n?' '+n:'').replace(/\{k\}/g,o.k!==undefined?o.k:'').replace(/\{g\}/g,o.g!==undefined?o.g:'').replace(/\{d\}/g,o.d!==undefined?o.d:'').replace(/\{t\}/g,o.t||'').replace(/\{s\}/g,(o.g!==undefined?o.g:o.k)>1?'s':''))}
const msgBank=k=>(MSG[S.tone]||MSG.motiv)[k]||MSG.motiv[k]||[''];
const msg=(k,o)=>{const v=pick(msgBank(k));return Array.isArray(v)?v.map(x=>msgFill(x,o)):msgFill(v,o)};
const msg2=(k,o)=>{const v=pick(msgBank(k));return msgFill(v,o).split('|')};
/* ---- pop-up « bon retour » ---- */
function helloPick(){const h=new Date().getHours(),ls=lastSess(),days=ls?Math.round((parse(TK)-parse(ls.date))/864e5):-1,ws=wStreak(),wm=monday(T).getTime(),wn=S.sessions.filter(s=>monday(parse(s.date)).getTime()===wm).length,goal=S.goal||3,c=[];
  if(!ls)return msg('first');if(days>=4)return msg('back',{d:days});
  if(T.getDate()<=3&&!Object.keys(obj(S.tests[TK.slice(0,7)])).length)c.push(msg('month'));
  if(ws>=3)c.push(msg('streak',{k:ws}));
  if(wn>=goal)c.push(msg('goalDone'));else if(wn>0)c.push(msg('goalLeft',{g:goal-wn}));
  if(h<11)c.push(msg('morning'));else if(h>=18)c.push(msg('evening'));
  c.push(msg('generic'));return pick(c)}
/* ---- message après l'ajout d'une séance ---- */
function afterAdd(ss,beat,c){const gh=checkGoals();if(gh.length)save();v6Saved();setTimeout(()=>snack('Séance enregistrée','Partager',()=>shareCard(ss.id)),2700);
  const nb=badgeList().filter(b=>b.on),wk=monday(T).getTime(),inWeek=monday(parse(ss.date)).getTime()===wk,wn=S.sessions.filter(s=>monday(parse(s.date)).getTime()===wk).length,goal=S.goal||3,ws=wStreak(),gap=c.last?Math.round((parse(ss.date)-parse(c.last.date))/864e5):0,run=noRestRun();let m;
  if(beat){celebrate(beat.name,beat.v,beat.unit,beat.prev);if(gh.length)setTimeout(()=>boomMsg(emo('Objectif atteint ! 🎯'),goalTxt(gh[0])),4200);afterRewards();return}
  if(gh.length)m=[msg('aGoal'),goalTxt(gh[0])];
  else if(nb.length>c.bad)m=[msg('aBadge'),nb.filter(b=>!c.badk||!c.badk.includes(b.k)).map(b=>b.t).pop()||nb[nb.length-1].t];
  else if(run>=7)m=msg2('aRun',{k:run});
  else if(inWeek&&c.wn<goal&&wn>=goal)m=msg2('aWeek',{k:wn});
  else if(gap>=5)m=msg2('aBack',{d:gap});
  else if(inWeek&&wn===1)m=goal>1?msg2('aFirst',{g:goal-1}):msg2('aWeek',{k:1});
  else if(ss.feel===3)m=msg2('aTop');
  else if(ss.feel===1)m=msg2('aBof');
  else if(ss.dur>=90)m=msg2('aLong',{t:fmtDur(ss.dur)});
  else if(ss.tod==='matin')m=msg2('aMorn');
  else if(inWeek&&wn<goal)m=msg2('aLeft',{g:goal-wn});
  else if(ws>=2)m=msg2('aStreak',{k:ws});
  else m=msg2('aGen');
  boomMsg(m[0],m[1]||'',sessArt(ss));afterRewards()}
