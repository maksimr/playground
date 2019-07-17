import { Issue, Resource } from './core/Resource';
import { Fields, Type } from './core/Fields';

main();

async function main() {
  const resource = Resource.for((location.search.slice(1) || 'https://youtrack.jetbrains.com'));

  const issues = await resource.query(new Issue({
    $top: 100,
    fields: Fields.serialize({
      idReadable: Type.String,
      summary: Type.String
    })
  }));

  document.getElementById('app').appendChild(
    issues.reduce((documentFragment, issue) => {
      const issueNode = document.createElement('div');
      issueNode.innerText = `${issue.idReadable}: ${issue.summary}`;
      documentFragment.appendChild(issueNode);
      return documentFragment;
    }, document.createDocumentFragment())
  );
}
