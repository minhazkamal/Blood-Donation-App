SET GLOBAL event_scheduler = ON;
DROP EVENT IF EXISTS `delete_unverified_email`;
CREATE EVENT `delete_unverified_email`  ON SCHEDULE EVERY 1 DAY 
STARTS '2010-01-01 00:00:00' 
DO 
DELETE FROM `bdapp`.`users` where DATEDIFF(now(),`joined`) > 1 and `email_verified` = 'no';

ALTER EVENT `delete_unverified_email` ON  COMPLETION PRESERVE ENABLE;

show events;