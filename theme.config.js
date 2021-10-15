const YEAR = new Date().getFullYear()

export default {
  footer: (
    <small style={{ display: 'flex', marginTop: '8rem' , flexDirection:'column'}}>
      <style jsx>{`
        a {
          float: right;
        }
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
      <span>Entre em contato comigo nas redes socias </span>
      <a href={'https://twitter.com/que_cara_legal'}> Twitter</a>
      <a href={'https://github.com/Grubba27'}> GitHub</a>
      <a href={'https://instagram.com/ggrubba'}> Instagram</a>
      Email: grubba27@hotmail.com -> Gabriel Grubba.
    </small>
  )
}
