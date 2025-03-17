// Error Page Component
 const ErrorPage = () => {
    return (
      <div className="container text-center mt-5">
        <h1 className="text-danger">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <a href="/" className="btn btn-primary">Go back to homepage</a>
      </div>
    );
};

export default ErrorPage;