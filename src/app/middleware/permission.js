export default async (req, res, next) => {
  // Verifica se usuário tem permissão
  if (!req.provider) {
    return res.status(401).json({ error: 'Usuário não autorizado' });
  }

  return next();
};
