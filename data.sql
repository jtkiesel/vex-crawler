insert into vex.program (robot_events_id, vex_db_id, code, name)
  values (1, 2, 'VRC', 'VEX Robotics Competition');

insert into vex.program (robot_events_id, vex_db_id, code, name)
  values (4, 1, 'VEXU', 'VEX U');

insert into vex.program (robot_events_id, code, name)
  values (40, 'CREATE', 'CREATE Foundation');

insert into vex.program (robot_events_id, vex_db_id, code, name)
  values (41, 3, 'VIQC', 'VEX IQ Challenge');

insert into vex.program (robot_events_id, code, name)
  values (44, 'ADC', 'Aerial Drone Competition');

insert into vex.program (robot_events_id, code, name)
  values (46, 'TVRC', 'TSA VEX Robotics Competition');

insert into vex.program (robot_events_id, code, name)
  values (47, 'TIQC', 'TSA VEX IQ Challenge');

insert into vex.program (robot_events_id, code, name)
  values (55, 'BellAVR', 'Bell Advanced Vertical Robotics Competition');

insert into vex.program (robot_events_id, code, name)
  values (56, 'FAC', 'VEX Factory Automation Competition');

insert into vex.program (robot_events_id, code, name)
  values (57, 'VAIC', 'VEX AI Competition');

insert into vex.season (vex_db_id, program_id, name, start, "end")
  values (1, (select id from vex.program where code = 'VRC'), 'Bridge Battle', '2007-09-12 EDT', '2008-05-04 23:59:59.999999 EDT');

insert into vex.season (vex_db_id, program_id, name, start, "end")
  values (2, (select id from vex.program where code = 'VEXU'), 'Elevation', '2008-08-18 EDT', '2009-05-03 23:59:59.999999 EDT');

insert into vex.season (vex_db_id, program_id, name, start, "end")
  values (3, (select id from vex.program where code = 'VRC'), 'Elevation', '2008-08-18 EDT', '2009-05-03 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (1, 5, (select id from vex.program where code = 'VRC'), 'Clean Sweep', '2009-05-03 EDT', '2010-04-25 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (4, 4, (select id from vex.program where code = 'VEXU'), 'Clean Sweep', '2009-05-03 EDT', '2010-04-25 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (7, 7, (select id from vex.program where code = 'VRC'), 'Round Up', '2010-04-25 EDT', '2011-04-17 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (10, 6, (select id from vex.program where code = 'VEXU'), 'Round Up', '2010-04-25 EDT', '2011-04-17 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (73, 9, (select id from vex.program where code = 'VRC'), 'Gateway', '2011-04-17 EDT', '2012-04-22 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (76, 8, (select id from vex.program where code = 'VEXU'), 'Gateway', '2011-04-17 EDT', '2012-04-22 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (85, 11, (select id from vex.program where code = 'VRC'), 'Sack Attack', '2012-04-22 EDT', '2013-04-21 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (88, 10, (select id from vex.program where code = 'VEXU'), 'Sack Attack', '2012-04-22 EDT', '2013-04-21 23:59:59.999999 EDT');

insert into vex.season (program_id, name, start, "end")
  values ((select id from vex.program where code = 'VIQC'), 'Rings-n-Things', '2013-02-08 EST', '2013-04-21 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (92, 13, (select id from vex.program where code = 'VRC'), 'Toss Up', '2013-04-21 EDT', '2014-04-27 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (93, 12, (select id from vex.program where code = 'VEXU'), 'Toss Up', '2013-04-21 EDT', '2014-04-27 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (96, (select id from vex.program where code = 'VIQC'), 'Add It Up', '2013-06-03 EDT', '2014-04-27 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (101, (select id from vex.program where code = 'VIQC'), 'Highrise', '2014-04-27 EDT', '2015-04-19 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (102, 15, (select id from vex.program where code = 'VRC'), 'Skyrise', '2014-04-27 EDT', '2015-04-19 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (103, 14, (select id from vex.program where code = 'VEXU'), 'Skyrise', '2014-04-27 EDT', '2015-04-19 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (109, (select id from vex.program where code = 'VIQC'), 'Bank Shot', '2015-04-19 EDT', '2016-04-24 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (110, 17, (select id from vex.program where code = 'VRC'), 'Nothing But Net', '2015-04-19 EDT', '2016-04-24 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (111, 16, (select id from vex.program where code = 'VEXU'), 'Nothing But Net', '2015-04-19 EDT', '2016-04-24 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (114, (select id from vex.program where code = 'VIQC'), 'Crossover', '2016-04-24 EDT', '2017-04-26 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (115, 19, (select id from vex.program where code = 'VRC'), 'Starstruck', '2016-04-24 EDT', '2017-04-23 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (116, 18, (select id from vex.program where code = 'VEXU'), 'Starstruck', '2016-04-24 EDT', '2017-04-23 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (119, 21, (select id from vex.program where code = 'VRC'), 'In the Zone', '2017-04-23 EDT', '2018-04-29 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, vex_db_id, program_id, name, start, "end")
  values (120, 20, (select id from vex.program where code = 'VEXU'), 'In the Zone', '2017-04-23 EDT', '2018-04-29 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (121, (select id from vex.program where code = 'VIQC'), 'Ringmaster', '2017-04-26 EDT', '2018-05-02 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (122, (select id from vex.program where code = 'CREATE'), 'CREATE 2017-2018', '2017-06-01 EDT', '2018-05-17 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (124, (select id from vex.program where code = 'VIQC'), 'Next Level', '2018-05-02 EDT', '2019-05-01 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (125, (select id from vex.program where code = 'VRC'), 'Turning Point', '2018-04-29 EDT', '2019-04-28 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (126, (select id from vex.program where code = 'VEXU'), 'Turning Point', '2018-04-29 EDT', '2019-04-28 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (127, (select id from vex.program where code = 'CREATE'), 'CREATE 2018-2019', '2018-06-06 EDT', '2019-05-01 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (129, (select id from vex.program where code = 'VIQC'), 'Squared Away', '2019-05-01 EDT', '2020-04-26 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (130, (select id from vex.program where code = 'VRC'), 'Tower Takeover', '2019-04-28 EDT', '2020-04-26 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (131, (select id from vex.program where code = 'VEXU'), 'Tower Takeover', '2019-04-28 EDT', '2020-04-26 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (132, (select id from vex.program where code = 'CREATE'), 'CREATE 2019-2020', '2019-07-23 EDT', '2020-05-01 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (135, (select id from vex.program where code = 'TIQC'), 'TSA VEX IQ 2019-2020', '2019-10-28 EDT', '2020-06-30 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (136, (select id from vex.program where code = 'TVRC'), 'TSA VRC 2019-2020', '2019-10-28 EDT', '2020-06-30 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (138, (select id from vex.program where code = 'VIQC'), 'Rise Above', '2020-04-26 EDT', '2021-05-27 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (139, (select id from vex.program where code = 'VRC'), 'Change Up', '2020-04-26 EDT', '2021-05-23 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (140, (select id from vex.program where code = 'VEXU'), 'Change Up', '2020-04-26 EDT', '2021-05-23 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (144, (select id from vex.program where code = 'ADC'), 'RADC 2020-2021', '2020-05-04 EDT', '2021-05-16 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (152, (select id from vex.program where code = 'BellAVR'), '2021 Bell Vertical Robotics Competition', '2020-12-01 EST', '2021-08-17 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (154, (select id from vex.program where code = 'VRC'), 'Tipping Point', '2021-05-23 EDT', '2022-05-07 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (155, (select id from vex.program where code = 'VIQC'), 'Pitching In', '2021-05-27 EDT', '2022-05-13 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (156, (select id from vex.program where code = 'VEXU'), 'Tipping Point', '2021-05-23 EDT', '2022-05-07 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (158, (select id from vex.program where code = 'ADC'), 'RADC 2021-2022 : DownDraft 2', '2021-04-15 EDT', '2022-04-18 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (166, (select id from vex.program where code = 'TIQC'), 'TSA VEX IQ 2021-2022', '2021-09-20 EDT', '2022-06-27 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (167, (select id from vex.program where code = 'TVRC'), 'TSA VRC 2021-2022', '2021-09-20 EDT', '2022-06-27 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (172, (select id from vex.program where code = 'BellAVR'), '2022 Bell Advanced Vertical Robotics Competition', '2022-02-01 EST', '2022-09-20 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (173, (select id from vex.program where code = 'VRC'), 'Spin Up', '2022-04-18 EDT', '2023-04-01 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (174, (select id from vex.program where code = 'VIQC'), 'Slapshot', '2022-04-18 EDT', '2023-04-04 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (175, (select id from vex.program where code = 'VEXU'), 'Spin Up', '2022-04-18 EDT', '2023-04-01 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (176, (select id from vex.program where code = 'ADC'), 'Aerial Drone Competition 2022-2023', '2022-04-18 EDT', '2023-04-01 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (177, (select id from vex.program where code = 'FAC'), 'FAC 2022-2023', '2022-11-01 EST', '2023-05-31 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (178, (select id from vex.program where code = 'TIQC'), 'TSA VEX IQ 2022-2023', '2022-10-11 EDT', '2023-06-03 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (179, (select id from vex.program where code = 'TVRC'), 'TSA VRC 2022-2023', '2022-10-11 EDT', '2023-06-03 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (180, (select id from vex.program where code = 'VIQC'), 'Full Volume', '2023-04-05 EDT', '2024-05-02 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (181, (select id from vex.program where code = 'VRC'), 'Over Under', '2023-04-02 EDT', '2024-05-02 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (182, (select id from vex.program where code = 'VEXU'), 'Over Under', '2023-04-02 EDT', '2024-05-02 23:59:59.999999 EDT');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (183, (select id from vex.program where code = 'BellAVR'), '2023 Bell Advanced Vertical Robotics Competition', '2023-03-22 EST', '2023-09-20 23:59:59.999999 EST');

insert into vex.season (robot_events_id, program_id, name, start, "end")
  values (184, (select id from vex.program where code = 'ADC'), 'Aerial Drone Competition 2023-2024', '2023-04-02 EDT', '2024-04-01 23:59:59.999999 EDT');
