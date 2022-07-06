module.exports.personPersmissions = (user, positions, functionName) => {
  if (functionName === 'ogt_1') {
    user.current_positions.function.function_short_name = 'OGT 1';
  }
  if (functionName === 'ogt_2') {
    user.current_positions.function.function_short_name = 'OGT 2';
  }
  if (functionName === 'ogv') {
    user.current_positions.function.function_short_name = 'OGV';
  }
  if (functionName === 'igv') {
    user.current_positions.function.function_short_name = 'IGV';
  }
  if (functionName === 'igt') {
    user.current_positions.function.function_short_name = 'IGT';
  }
  if (functionName === 'mkt') {
    user.current_positions.function.function_short_name = 'MKT';
  }
  if (functionName === 'im') {
    user.is_admin = true;
    user.current_positions.function.function_short_name = 'IM';
  }
  if (functionName === 'f&l') {
    user.current_positions.function.function_short_name = 'F&L';
  }
  if (functionName === 'pd') {
    user.current_positions.function.function_short_name = 'PD';
  }
  if (functionName === 'tm') {
    user.current_positions.function.function_short_name = 'TM';
  }

  if (positions === 'vice president' || positions === 'local committee president') {
    user.is_eb = true;
    user.can_vote = true;
  }
  if (positions === 'local committee president') {
    user.is_lcp = true;
  }
  if (positions === 'alumni') {
    user.is_alumni = true;
  }
  if (positions === 'team leader') {
    user.is_tl = true;
  }
  if (positions === 'team member') {
    user.is_member = true;
  }
  if (positions === 'manager') {
    user.is_manager = true;
  }

  user.is_verified = true;
};

module.exports.setShortName = (funcName) => {
  console.log(funcName);
  if (funcName === 'ogt_1') return 'OGT 1';

  if (funcName === 'ogt_2') return 'OGT 2';

  if (funcName === 'ogv') return 'OGV';

  if (funcName === 'igv') return 'IGV';

  if (funcName === 'igt') return 'IGT';

  if (funcName === 'mkt') return 'MKT';

  if (funcName === 'im') return 'IM';

  if (funcName === 'f&l') return 'F&L';

  if (funcName === 'pd') return 'PD';

  if (funcName === 'tm') return 'TM';

  return 'none';
};
