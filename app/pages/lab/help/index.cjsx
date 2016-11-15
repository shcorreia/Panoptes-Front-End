counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link, IndexLink} = require 'react-router'

counterpart.registerTranslations 'en',
  help:
    title: 'Help'
    nav:
      howTo: 'How to'
      policies: 'Policies'
      glossary: 'Glossary'
      bestPractices: 'Best Practices'

module.exports = React.createClass
  displayName: 'HowTo'

  contextTypes:
    geordi: React.PropTypes.object

  componentWillReceiveProps: (nextProps, nextContext)->
    @logClick = nextContext?.geordi?.makeHandler? 'about-menu'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <div className="secondary-page about-page">
      <section className="hero">
        <div className="hero-container">
          <Translate content="help.title" component="h1" />
          <nav className="hero-nav">
            <IndexLink to="/help" activeClassName="active"><Translate content="help.nav.howTo" /></IndexLink>
            <Link to="/help/glossary" activeClassName="active" onClick={@logClick?.bind(this, 'help.nav.glossary')}><Translate content="help.nav.glossary"/></Link>
            <Link to="/help/lab-policies" activeClassName="active" onClick={@logClick?.bind(this, 'help.nav.policies')}><Translate content="help.nav.policies" /></Link>
            <Link to="/lab-best-practices/introduction" activeClassName="active" onClick={@logClick?.bind(this, 'help.nav.bestPractices')}><Translate content="help.nav.bestPractices" /></Link>
          </nav>
        </div>
      </section>
      <section className="about-page-content content-container">
        {@props.children}
      </section>
    </div>
