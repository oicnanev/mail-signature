# Assinatura de email (Vallado)

Gerador de assinaturas de email em HTML, em duas versões (clara e escura), a partir da maquete do designer. Abre `index.html`, preenche os campos, escolhe a versão e carrega em **Copiar assinatura**.

## Ficheiros

| Ficheiro | Para quê |
|---|---|
| `index.html` | Formulário + pré-visualização + botão de copiar |
| `assinatura.js` | Gera o HTML da assinatura (tabelas + CSS inline) |
| `img/` | `logo-vallado.png` e `logo-patrocinio.png` (2×, exportados do PDF) |
| `test.js` | Auto-teste: `node test.js` |

## Antes de usar: alojar as imagens

Os clientes de email só mostram imagens que estejam num endereço público `https`.

1. Põe os 2 ficheiros de `img/` numa pasta pública, por exemplo `https://www.quintadovallado.com/assinatura/img/`.
2. No gerador, preenche **Endereço das imagens** com essa pasta (tem de acabar em `/`).

Para trocar o patrocinador, substitui `logo-patrocinio.png` no mesmo endereço. Todas as assinaturas já enviadas passam a mostrar o novo logo. Quem apagar ou mover os ficheiros parte todas as assinaturas.

## Como usar a assinatura

- **Gmail:** Definições → Ver todas as definições → Assinatura → colar.
- **Outlook (desktop):** Ficheiro → Opções → Correio → Assinaturas → colar.

## Limites conhecidos

- A versão (clara/escura) é uma escolha de quem envia; o destinatário vê sempre a mesma, porque os fundos estão fixados na assinatura.
- Largura fixa de 600 px (sem layout responsivo próprio).
- Tipo de letra: Garamond se existir, senão Times New Roman. O texto continua editável, mas o aspeto varia ligeiramente.
- No Outlook desktop os ícones IG/FB/LK aparecem quadrados em vez de redondos.
- O logo e o logo do patrocinador foram exportados do PDF (vetor rasterizado). Se o designer enviar os originais, substituir os ficheiros de `img/` com o mesmo nome e proporção (280×256 e 308×256).
- Os campos preenchidos ficam guardados no navegador (`localStorage`).
