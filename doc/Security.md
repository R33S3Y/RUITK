A list of all known possible security risks with RUITK
## Untrusted elements via makeElements

When parsing in a untrusted str with `makeElements` it could be possible to define a RUITK element in the untrusted str. Eg: in a markdown file

I believe that their is currently nothing stopping this. and mitigation need to be put in place


## Untrusted functions via makeElements

When parsing in a untrusted str with `makeElements` it could be possible to define a js function in the untrusted str.
As bad as this sounds I believe that this is currently fine as their is known way to call the function unless it is done so by a element. So as long as the [Untrusted elements via makeElements](Security.md#Untrusted%20elements%20via%20makeElements) is properly handled this should be fine. 

