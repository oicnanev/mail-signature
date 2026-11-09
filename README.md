# Assinatura de email (Vallado)

Gerador de assinaturas de email em HTML, em duas versões (clara e escura). Abre `index.html`, preenche os campos, escolhe a versão e carrega em **Copiar assinatura**.

## Ficheiros

| Ficheiro | Para quê |
|---|---|
| `index.html` | Formulário + pré-visualização + botão de copiar |
| `signature.js` | Gera o HTML da assinatura (tabelas + CSS inline) |
| `img/` | `logo-vallado.png` e `logo-sponsor.png` (2×, exportados do PDF) |
| `test.js` | Auto-teste: `node test.js` |

## Online

- Gerador: <https://oicnanev.github.io/mail-signature/>
- Imagens (GitHub Pages): <https://oicnanev.github.io/mail-signature/img/>. É o endereço predefinido no gerador.

## Alojar as imagens noutro sítio

Os clientes de email só mostram imagens que estejam num endereço público `https`. O endereço do GitHub Pages serve para começar. Mais tarde convém mudar para o site da Vallado, uma vez que não têm acesso à alteração de imagens:

1. Colocar os 2 ficheiros de `img/` numa pasta pública, por exemplo `https://www.quintadovallado.com/assinatura/img/`.
2. No gerador, preencher **Endereço das imagens** com o endereço dessa pasta (tem de acabar em `/`).
3. As assinaturas já enviadas continuam a apontar para o endereço antigo, o GitHub Pages enquanto forem usadas.

Para trocar o patrocinador, substituir `logo-sponsor.png` no mesmo endereço. Todas as assinaturas já enviadas passam a mostrar o novo logo. Quem apagar ou mover os ficheiros parte todas as assinaturas.

## Como usar a assinatura

- **Gmail:** Definições → Ver todas as definições → Assinatura → colar.
- **Outlook (desktop):** Ficheiro → Opções → Correio → Assinaturas → colar.

## Limites conhecidos

- A versão (clara/escura) é uma escolha de quem envia; o destinatário vê sempre a mesma, porque os fundos estão fixados na assinatura.
- Largura fixa de 600 px.
- Tipo de letra: Garamond se existir no equipamento de quem recebe / envia o email, senão Times New Roman. O texto continua editável, mas o aspeto varia ligeiramente.
- No Outlook desktop os ícones IG/FB/LK aparecem quadrados em vez de redondos.
- O logotipo e o logotipo do patrocinador foram exportados do PDF (vetor rasterizado). Caso haja originais, substituir os ficheiros de `img/` com o mesmo nome e proporção (280×256 e 308×256).
- Os campos preenchidos ficam guardados no navegador (`localStorage`).
