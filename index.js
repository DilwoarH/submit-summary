const cheerio = require('cheerio');
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = process.env.PORT || 3000;

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

const CSV_URL = 'https://datasette.planning.data.gov.uk/performance.csv?sql=select%0D%0A++organisation%2C%0D%0A++organisation_name%2C%0D%0A++count_issue_error_external+as+%22number_of_errors%22%0D%0Afrom%0D%0A++provision_summary%0D%0Awhere%0D%0A++%22count_issue_error_external%22+%3E+0%0D%0A++and+%22organisation%22+in+%28%0D%0A++++%22local-authority%3ALBH%22%2C%0D%0A++++%22local-authority%3ABUC%22%2C%0D%0A++++%22local-authority%3ASWK%22%2C%0D%0A++++%22local-authority%3ACMD%22%2C%0D%0A++++%22local-authority%3ANBL%22%2C%0D%0A++++%22local-authority%3ANED%22%2C%0D%0A++++%22local-authority%3ACMD%22%2C%0D%0A++++%22local-authority%3ADAC%22%2C%0D%0A++++%22local-authority%3ADNC%22%2C%0D%0A++++%22local-authority%3AGLO%22%2C%0D%0A++++%22local-authority%3ACAT%22%2C%0D%0A++++%22local-authority%3AMDW%22%2C%0D%0A++++%22local-authority%3ANET%22%2C%0D%0A++++%22local-authority%3ABIR%22%2C%0D%0A++++%22local-authority%3ACAT%22%2C%0D%0A++++%22local-authority%3AEPS%22%2C%0D%0A++++%22local-authority%3ABNE%22%2C%0D%0A++++%22local-authority%3AGRY%22%2C%0D%0A++++%22local-authority%3AGAT%22%2C%0D%0A++++%22local-authority%3AKTT%22%2C%0D%0A++++%22local-authority%3ATEW%22%2C%0D%0A++++%22local-authority%3AWBK%22%2C%0D%0A++++%22local-authority%3ASAL%22%2C%0D%0A++++%22local-authority%3ADST%22%2C%0D%0A++++%22local-authority%3ADOV%22%2C%0D%0A++++%22local-authority%3ALIV%22%2C%0D%0A++++%22local-authority%3ARED%22%2C%0D%0A++++%22local-authority%3AWFT%22%2C%0D%0A++++%22local-authority%3ANLN%22%2C%0D%0A++++%22local-authority%3ANSM%22%2C%0D%0A++++%22local-authority%3ASLF%22%2C%0D%0A++++%22local-authority%3AWRL%22%2C%0D%0A++++%22local-authority%3AASF%22%2C%0D%0A++++%22local-authority%3ABAI%22%2C%0D%0A++++%22local-authority%3ABOL%22%2C%0D%0A++++%22local-authority%3AEHE%22%2C%0D%0A++++%22local-authority%3ABDG%22%2C%0D%0A++++%22local-authority%3AMIK%22%2C%0D%0A++++%22local-authority%3ARCH%22%2C%0D%0A++++%22local-authority%3ASST%22%2C%0D%0A++++%22local-authority%3ATRF%22%2C%0D%0A++++%22local-authority%3AWSM%22%2C%0D%0A++++%22local-authority%3AEHE%22%2C%0D%0A++++%22local-authority%3AHOR%22%2C%0D%0A++++%22local-authority%3ALCE%22%2C%0D%0A++++%22local-authority%3ABDG%22%2C%0D%0A++++%22local-authority%3ACRY%22%2C%0D%0A++++%22local-authority%3AENF%22%2C%0D%0A++++%22local-authority%3AHRY%22%2C%0D%0A++++%22local-authority%3AHNS%22%2C%0D%0A++++%22local-authority%3ATWH%22%2C%0D%0A++++%22local-authority%3AMIK%22%2C%0D%0A++++%22local-authority%3ANEW%22%2C%0D%0A++++%22national-park-authority%3AQ72617158%22%2C%0D%0A++++%22local-authority%3ANYUA%22%2C%0D%0A++++%22local-authority%3ANBL%22%2C%0D%0A++++%22local-authority%3APTE%22%2C%0D%0A++++%22local-authority%3APLY%22%2C%0D%0A++++%22local-authority%3ARCH%22%2C%0D%0A++++%22local-authority%3AROS%22%2C%0D%0A++++%22local-authority%3AROH%22%2C%0D%0A++++%22local-authority%3AKEC%22%2C%0D%0A++++%22local-authority%3ASAW%22%2C%0D%0A++++%22local-authority%3ASCA%22%2C%0D%0A++++%22local-authority%3ASGC%22%2C%0D%0A++++%22local-authority%3ASST%22%2C%0D%0A++++%22local-authority%3ASPE%22%2C%0D%0A++++%22local-authority%3ASUR%22%2C%0D%0A++++%22local-authority%3ATAN%22%2C%0D%0A++++%22local-authority%3ATEN%22%2C%0D%0A++++%22local-authority%3ATOB%22%2C%0D%0A++++%22local-authority%3ATRF%22%2C%0D%0A++++%22local-authority%3AWAE%22%2C%0D%0A++++%22local-authority%3AWSM%22%2C%0D%0A++++%22local-authority%3ASNO%22%2C%0D%0A++++%22local-authority%3ABRO%22%2C%0D%0A++++%22local-authority%3ABST%22%2C%0D%0A++++%22local-authority%3ACAS%22%2C%0D%0A++++%22local-authority%3ACBF%22%2C%0D%0A++++%22local-authority%3ALND%22%2C%0D%0A++++%22local-authority%3AYOR%22%2C%0D%0A++++%22local-authority%3AECA%22%2C%0D%0A++++%22local-authority%3AEHA%22%0D%0A++%29%0D%0A++and+dataset+in+%28%0D%0A++++%27article-4-direction%27%2C%0D%0A++++%27article-4-direction-area%27%2C%0D%0A++++%27conservation-area%27%2C%0D%0A++++%27conservation-area-document%27%2C%0D%0A++++%27tree-preservation-order%27%2C%0D%0A++++%27tree-preservation-zone%27%2C%0D%0A++++%27tree%27%2C%0D%0A++++%27listed-building%27%2C%0D%0A++++%27listed-building-outline%27%0D%0A++%29%0D%0Agroup+by%0D%0A++organisation%0D%0Aorder+by+organisation_name&p0=&_size=max';


// Function to fetch CSV data, parse, and extract information from each organisation page
async function fetchOrganisationData (csvUrl) {
  try {
    // Step 1: Fetch CSV from URL
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Step 2: Parse CSV
    const rows = csvText.trim().split('\n')
    const headers = rows[0].split(',')
    const organisationIndex = headers.indexOf('organisation')
    const organisationNameIndex = headers.indexOf('organisation_name')

    // Step 3: Prepare output data structure
    const organisationSummary = []

    // Loop through each row, skipping the header
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',')
      const organisation = row[organisationIndex].trim()
      const organisationName = row[organisationNameIndex].trim()

      // Construct URL for each organisation
      const url = `https://submit.planning.data.gov.uk/organisations/${organisation}`

      // Step 4: Fetch HTML page content for each organisation
      try {
        const pageResponse = await fetch(url)
        const pageHtml = await pageResponse.text()

        // Step 5: Parse HTML and extract text using CSS selector
        const $ = cheerio.load(pageHtml)
        const listItems = $('.govuk-task-list__item.govuk-task-list__item--with-link')

        let summary = []

        listItems.each((i, el) => {
          const data = {
            dataset: $(el).find('.govuk-task-list__link').text().trim(),
            error_sumamry: $(el).find('.govuk-task-list__hint').text().trim(),
            status: $(el).find('.govuk-task-list__status').text().trim()
          }

          summary.push(data)
        })


        const combinedSummary = summary.map(item => `${item.status === "Live" ? "✅": "❌"} ${item.dataset}: ${item.error_sumamry} (${item.status})`)

        // Append to output data
        organisationSummary.push({
          organisation,
          organisationName,
          summary: combinedSummary
        })
      } catch (err) {
        console.error(`Error fetching page for organisation ${organisation}:`, err)
        organisationSummary.push({
          organisation,
          organisationName,
          summary: ['Error fetching or parsing content']
        })
      }
    }

    return organisationSummary
  } catch (err) {
    console.error('Error fetching or processing CSV:', err)
  }
}

app.get('/', async (req, res) => {
  try {
    const summary = await fetchOrganisationData(CSV_URL);
    res.render('index.html', { summary });
  } catch (err) {
    res.status(500).send('Error fetching organisation data');
  }
});

app.get('/api', async (req, res) => {
  try {
    const summary = await fetchOrganisationData(CSV_URL);
    res.json(summary);
  } catch (err) {
    res.status(500).send('Error fetching organisation data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
