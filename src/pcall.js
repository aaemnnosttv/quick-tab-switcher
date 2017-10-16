import Q from 'q'

// Takes a function that takes a set of arguments and
// a callback (NON-Node.js style) and turns it into a promise
// that gets resolved with the arguments to the callback.
export default function(fn, ...args) {
    const deferred = Q.defer()

    args.push(function() {
      deferred.resolve(Array.from(arguments)[0])
    })

    fn.apply(null, args)

    return deferred.promise
}
