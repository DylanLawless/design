The style is compact, factual, and citation-led.

It follows this pattern:

```text
Name: functional description, publication status in Author et al (Year)
```

The language has these features:

* Starts with the tool/resource name, followed by a colon.
* Uses a short gerund or noun phrase: “detecting”, “identifying”, “constructing”, “variant calling”, “splice site scoring”.
* Describes the practical function, not the marketing value.
* Avoids adjectives unless they are factual and useful, such as “long-read”, “short-read”, “phased”, “diploid”, “interactive”.
* Mentions the main data type or context: long reads, RNA-seq, BED files, HLA/KIR genes, pangenome graphs.
* Ends with evidence status: published, preprinted, developed for, unpublished.
* Keeps each entry to one line.
* Uses plain technical language with no hype.
* Allows brief caveats when useful: “not recommended for production”, “used by minigraph”.

A good prompt for generating similar entries:

```text
Write concise technology list entries in the following style:

Name: practical function in a short technical phrase, publication or evidence status in Author et al (Year)

Style rules:
- One line per entry.
- Start with the technology name followed by a colon.
- Use direct, factual technical language.
- Describe what the tool/resource does, not why it is impressive.
- Prefer phrases like “variant calling”, “constructing”, “annotating”, “scoring”, “evaluating”, “assembling”, “alignment”, or “analysis”.
- Mention the relevant data type, biological context, or use case where needed.
- Avoid marketing language, broad claims, and unnecessary adjectives.
- End with publication status where available: “published in…”, “preprinted in…”, “developed for…”, “described in…”, or “unpublished”.
- Keep each entry short, ideally 10 to 20 words after the colon.
- Add a short caveat only when it is practically important.

Examples:
Breakinator: detecting foldback artifacts in long reads, published in Heinz et al (2026)
myloasm: metagenome assembler for PacBio HiFi and Nanopore R10 reads, preprinted in Shaw et al (2025)
longcallD: small and large variant calling from long genomic reads, unpublished
minimap2: widely used long-read aligner, published in Li (2018) and improved in Li (2021)

Now write entries for the following technologies:
[PASTE TECHNOLOGY NAMES, DESCRIPTIONS, URLS, AND PUBLICATION DETAILS]
```

For your site, I would slightly adapt the line format to include the link:

```text
[Name](/url/): practical function, publication status in Author et al (Year)
```

Example:

```markdown
[Quant Scan](source/quant-scan/): interpreting processed genome results with probability-based evidence models, described in [Lawless et al (2026)](link to main article)
```



Link rules

1. Technology name
   Link to the public technology page:
   https://switzerlandomics.ch/technologies/page_slug/

2. Publication
   Link the citation text itself to the best publication URL.
   Use the published DOI if available.
   Use the preprint DOI only if no published article exists.
   Do not add a separate DOI badge for the same publication URL.

3. Package metrics
   Include badges only when there is a real package or software metric:
   CRAN version
   CRAN downloads
   GitHub stars
   Bioconductor version/downloads
   Zenodo software release DOI, only when it refers to a software or dataset release rather than duplicating the article DOI

4. GitHub
   Include a GitHub badge if there is a repository URL.
   Link the badge to the repository.

5. No metrics
   If there is no package, repository, download counter, or software release, end after the publication citation.

6. Publication status wording
   Use “published in” when there is a peer-reviewed article.
   Use “preprinted in” when only a preprint exists.
   Use “described in” for a software, database, or standard without a conventional article.
   Use “unpublished” only when there is no publication or public citable release.
