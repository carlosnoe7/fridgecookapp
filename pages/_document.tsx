import Document, { Html, Head, Main, NextScript } from "next/document"
import { extractCss } from "goober"

export default class MyDocument extends Document<{ css: any }> {
  static async getInitialProps({ renderPage }: { renderPage: any }) {
    const page = await renderPage()
    // Extrach the css for each page render
    const css = extractCss()
    return { ...page, css }
  }

  render() {
    return (
      <Html>
        <Head>
          <style
            id={"_goober"}
            dangerouslySetInnerHTML={{ __html: " " + this.props.css }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
