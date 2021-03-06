﻿--#######################################################################################################
--TRUMPF Werkzeugmaschinen GmbH & Co KG
--TEMPLATE FOR DATABASE PATCHES, HOT FIXES and SCHEMA CHANGES
--Author: Marcel Ely Gomes
--CreateAt: 2018-02-14
--Version: 00.00.01 (Initial)
--#######################################################################################################
-- READ THE INSTRUCTIONS BEFORE CONTINUE - USE ONLY PatchDBTool to deploy patches to existing Databases
-- Describe your patch here
-- Patch Description:
-- 	1) Why is this Patch necessary?
-- 	2) Which Git Issue Number is this patch solving?
-- 	3) Which changes are going to be done?
-- PATCH FILE NAME - THIS IS MANDATORY
-- iuno_<databasename>_V<patchnumber>V_<creation date>.sql
-- PatchNumber Format: 00000 whereas each new Patch increase the patchnumber by 1
-- Example: iuno_marketplacecore_V00001V_20170913.sql
--#######################################################################################################
-- PUT YOUR STATEMENTS HERE:
-- 	1) Why is this Patch necessary?
--  Proof if procedure caller is also data owner or has permissions to do it
-- 	2) Which Git Issue Number is this patch solving?
--  #127
-- 	3) Which changes are going to be done?
--  Update diverse Store Procedures
--: Run Patches
------------------------------------------------------------------------------------------------
--##############################################################################################
-- Write into the patch table: patchname, patchnumber, patchdescription and start time
--##############################################################################################
DO
$$
	DECLARE
		PatchName varchar		 	 := 'iuno_marketplacecore_V0025V_20180214';
		PatchNumber int 		 	 := 0025;
		PatchDescription varchar 	 := 'Proof if procedure caller is also data owner or has permissions to do it.';
		CurrentPatch int 			 := (select max(p.patchnumber) from patches p);

	BEGIN
		--INSERT START VALUES TO THE PATCH TABLE
		IF (PatchNumber <= CurrentPatch) THEN
			RAISE EXCEPTION '%', 'Wrong patch number. Please verify your patches!';
		ELSE
			INSERT INTO PATCHES (patchname, patchnumber, patchdescription, startat) VALUES (PatchName, PatchNumber, PatchDescription, now());
		END IF;
	END;
$$;
------------------------------------------------------------------------------------------------
--##############################################################################################
-- Run the patch itself and update patches table
--##############################################################################################
DO
$$
		DECLARE
			vPatchNumber int := 0025;
		BEGIN
-- #########################################################################################################################################


 CREATE OR REPLACE FUNCTION public.deletetechnologydata(
    vtechnologydatauuid uuid,
    vuseruuid uuid,
    vroles text[])
  RETURNS boolean AS
$BODY$

	DECLARE
		vFunctionName varchar := 'DeleteTechnologyData';
		vIsAllowed boolean := (select public.checkPermissions(vuseruuid, vRoles, vFunctionName));
		vOwnerUUID uuid := (select createdby from technologydata where technologydatauuid = vTechnologyDataUUID);
		--TODO: update this. Do not use only Admin but other Roles => Create a table for that.
		vAdmin text := 'Admin';

	BEGIN

	IF(vIsAllowed) THEN

		IF (vUserUUID = vOwnerUUID or vAdmin = ANY(vRoles)) THEN

		 update technologydata set deleted = true
		 where technologydatauuid = vTechnologyDataUUID
		 and (createdby = vuseruuid or vAdmin = ANY(vRoles));

		 ELSE

			 RAISE EXCEPTION '%', 'You are not allowed to run this procedure: ' || vFunctionName || '.';
			 RETURN false;

		 END IF;

	ELSE
		 RAISE EXCEPTION '%', 'Insufficiency rigths';
		 RETURN false;
	END IF;

	-- Begin Log if success
		perform public.createlog(0,'Delete TechnologyData successfull', 'DeleteTechnologyData',
								'TechnologyDataID: ' || cast(vtechnologydatauuid as varchar));

		-- End Log if success
		RETURN true;
	 -- Begin Log if error
		perform public.createlog(1,'ERROR: ' || SQLERRM || ' ' || SQLSTATE, 'DeleteTechnologyData',
								'TechnologyDataID: ' || cast(vtechnologydatauuid as varchar));
		-- End Log if error
		RAISE EXCEPTION '%', 'ERROR: ' || SQLERRM || ' ' || SQLSTATE || ' at CreateTechnologyDataComponents';
	RETURN false;

	END;
$BODY$
  LANGUAGE plpgsql;

--#################################################################################################################
DROP FUNCTION gettechnologydatabyid(uuid,uuid,text[]);

CREATE OR REPLACE FUNCTION public.gettechnologydatabyid(
	vtechnologydatauuid uuid,
	vuseruuid uuid,
	vroles text[])
    RETURNS TABLE(technologydatauuid uuid, technologyuuid uuid, technologydataname character varying, technologydata character varying, technologydatadescription character varying, productcode integer, licensefee bigint, technologydatathumbnail bytea, technologydataimgref character varying, createdat timestamp with time zone, createdby uuid, updatedat timestamp with time zone, updatedyby uuid) 
    
AS $BODY$

	DECLARE
		vFunctionName varchar := 'GetTechnologyDataById';
		vIsAllowed boolean := (select public.checkPermissions(vuseruuid, vRoles, vFunctionName));
		vOwnerUUID uuid := (select t.createdby from technologydata t where t.technologydatauuid = vTechnologyDataUUID);
		--TODO: update this. Do not use only Admin but other Roles => Create a table for that.
		vAdmin text := 'Admin';
		vMachineOperator text := 'MachineOperator';

	BEGIN

	IF(vIsAllowed) THEN

		IF (vUserUUID = vOwnerUUID or vAdmin = ANY(vRoles) or vMachineOperator = ANY(vRoles)) THEN

	RETURN QUERY (	SELECT 	td.technologydatauuid,
				tc.technologyuuid,
				td.technologydataname,
				td.technologydata,
				td.technologydatadescription,
				td.productcode,
				td.licensefee,
				td.technologydatathumbnail,
				td.technologydataimgref,
				td.createdat  at time zone 'utc',
				td.createdby,
				td.updatedat  at time zone 'utc',
				td.updatedby
				FROM TechnologyData td
				join technologies tc
				on td.technologyid = tc.technologyid
				where td.technologydatauuid = vtechnologydatauuid
				and td.deleted is null
				and (td.createdby = vuseruuid or vAdmin = ANY(vRoles) or vMachineOperator = ANY(vRoles))
		);

		ELSE

			 RAISE EXCEPTION '%', 'You are not allowed to run this procedure: ' || vFunctionName || '.';
			 RETURN;

		 END IF;

	ELSE
		 RAISE EXCEPTION '%', 'Insufficiency rigths';
		 RETURN;
	END IF;

	END;

$BODY$
  LANGUAGE plpgsql;

--#################################################################################################################
DROP FUNCTION gettechnologydatabyname(character varying,uuid,text[]);

CREATE OR REPLACE FUNCTION public.gettechnologydatabyname(
    IN vtechnologydataname character varying,
    IN vuseruuid uuid,
    IN vroles text[])
  RETURNS TABLE(technologydatauuid uuid, technologyuuid uuid, technologydataname character varying, technologydata character varying, technologydatadescription character varying, productcode integer, licensefee bigint, technologydatathumbnail bytea, technologydataimgref character varying, createdat timestamp with time zone, createdby uuid, updatedat timestamp with time zone, updatedby uuid) AS
$BODY$
	DECLARE
		vFunctionName varchar := 'GetTechnologyDataByName';
		vIsAllowed boolean := (select public.checkPermissions(vuseruuid, vRoles, vFunctionName));
		vOwnerUUID uuid := (select t.createdby from technologydata t where t.technologydataname = vTechnologyDataName);
		--TODO: update this. Do not use only Admin but other Roles => Create a table for that.
		vAdmin text := 'Admin';

	BEGIN

	IF(vIsAllowed) THEN
		IF (vUserUUID = vOwnerUUID or vAdmin = ANY(vRoles) or vOwnerUUID is null) THEN

    	RETURN QUERY (SELECT 	td.technologydatauuid,
				tc.technologyuuid,
				td.technologydataname,
				td.technologydata,
				td.technologydatadescription,
				td.productcode,
				td.licensefee,
				td.technologydatathumbnail,
				td.technologydataimgref,
				td.createdat  at time zone 'utc',
				td.createdby,
				td.updatedat  at time zone 'utc',
				td.updatedBy
			FROM TechnologyData td
			join technologies tc
			on td.technologyid = tc.technologyid
			where lower(td.technologydataname) = lower(vTechnologyDataName)
			and td.deleted is null
			and (td.createdby = vuseruuid or vAdmin = ANY(vRoles))
		);

		ELSE

			 RAISE EXCEPTION '%', 'You are not allowed to run this procedure: ' || vFunctionName || '.';
			 RETURN;

		 END IF;

	ELSE
		 RAISE EXCEPTION '%', 'Insufficiency rigths';
		 RETURN;
	END IF;

	END;
	$BODY$
  LANGUAGE plpgsql;

--######################################################################################################################
DROP FUNCTION public.gettechnologydataforuser(uuid, text[]);

CREATE OR REPLACE FUNCTION public.gettechnologydataforuser(
    IN vuseruuid uuid,
    IN vInquirerID uuid,
    IN vroles text[])
  RETURNS TABLE(technologydatauuid uuid, technologydataname character varying, revenue bigint, licensefee bigint, componentlist text[], technologydatadescription character varying) AS
$BODY$
				DECLARE
					vFunctionName varchar := 'GetTechnologyDataForUser';
					vIsAllowed boolean := (select public.checkPermissions(vInquirerID, vRoles, vFunctionName));
					--TODO: update this. Do not use only Admin but other Roles => Create a table for that.
					vAdmin text := 'Admin';

				BEGIN

				IF(vIsAllowed) THEN
					IF (vUserUUID = vInquirerID or vAdmin = ANY(vRoles)) THEN


				RETURN QUERY (	with revenue as (select td.technologydataname, (sum(td.licensefee*ri.amount))::bigint as revenue from transactions ts
						join licenseorder lo
						on ts.licenseorderid = lo.licenseorderid
						join offerrequest oq
						on oq.offerrequestid = ts.offerrequestid
						join offerrequestitems ri
						on oq.offerrequestid = ri.offerrequestid
						join technologydata td
						on ri.technologydataid = td.technologydataid
						where td.createdby = vUserUUID
						group by td.technologydataname
					), result as (
					select 	td.technologydatauuid,
						td.technologydataname,
						coalesce(rv.revenue,0)::bigint as revenue,
						td.licensefee,
						array_agg(co.componentname)::text[] as componentlist,
						td.technologydatadescription
					from technologydata td
					left outer join revenue rv on td.technologydataname = rv.technologydataname
					join technologydatacomponents tc
					on tc.technologydataid = td.technologydataid
					join components co
					on tc.componentid = co.componentid
					where td.createdby = vUserUUID
					and td.deleted is null
					group by td.technologydatauuid, td.technologydataname, td.licensefee, rv.revenue, td.technologydatadescription)
					select  r.technologydatauuid,
						r.technologydataname,
						sum(r.revenue)::bigint as revenue,
						r.licensefee::bigint,
						r.componentlist,
						r.technologydatadescription
					from result r
					group by r.technologydatauuid,
						r.technologydataname,
						r.licensefee,
						r.componentlist,
						r.technologydatadescription
					);

				ELSE

					RAISE EXCEPTION '%', 'You are not allowed to run this procedure: ' || vFunctionName ||'.';
					RETURN;

				END IF;

				ELSE
					 RAISE EXCEPTION '%', 'Insufficiency rigths';
					 RETURN;
				END IF;

				END;
			$BODY$
  LANGUAGE plpgsql;


----------------------------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------------------------
    -- UPDATE patch table status value
    UPDATE patches SET status = 'OK', endat = now() WHERE patchnumber = vPatchNumber;
    --ERROR HANDLING
    EXCEPTION WHEN OTHERS THEN
        UPDATE patches SET status = 'ERROR: ' || SQLERRM || ' ' || SQLSTATE || 'while creating patch.'	WHERE patchnumber = vPatchNumber;
     RETURN;
END;
$$;
