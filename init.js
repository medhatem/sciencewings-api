db.createUser({
    user: 'dev',
    pwd: 'password',
    roles: [{role: 'readWrite', db: 'mana'}],
});
// db = db.getSiblingDB('mana');
// db.article.drop();

// db.article.save({});
