Emitir acción del administrador de etiquetas
Esta acción de GitHub le permite establecer de forma declarativa las etiquetas que se definirán en un repositorio.

En el repositorio en el que le gustaría usar esto, defina un archivo JSON en formato .github/labels.json. Este archivo contendrá una matriz de objetos que tienen un nombre, color y descripción, como se muestra en el siguiente ejemplo.

archivo tags.json

Luego, configure un flujo de trabajo que ejecute esta acción. Cuando se ejecuta, actualizará la lista de etiquetas en el repositorio para que coincida con el archivo JSON. Si desea que esto elimine cualquier etiqueta que no esté en el archivo JSON, establezca la deleteentrada en verdadero como se muestra en el siguiente ejemplo.

El resultado de usar el archivo labels.json que se muestra arriba es el siguiente:

Resultado de etiquetas

Si una etiqueta no necesita una descripción, omita el descriptioncampo de la entrada en el archivo json y, cuando se implemente, la etiqueta no contendrá una descripción.

Uso
Esta acción solo necesita el secreto de GITHUB_TOKEN, ya que interactúa con la API de GitHub para modificar las etiquetas. La acción se puede utilizar como tal:

on : issues 
name : Create Default Labels 
jobs :
   labels :
     name : DefaultLabelsActions se 
    ejecuta en : ubuntu-latest 
    steps :
      - uses : actions/checkout@1.0.0 
      - uses : lannonbr/issue-label-manager-action@3.0.0 
        env :
           GITHUB_TOKEN : $ {{secrets.GITHUB_TOKEN}} 
        with :
           delete : true # eliminará
